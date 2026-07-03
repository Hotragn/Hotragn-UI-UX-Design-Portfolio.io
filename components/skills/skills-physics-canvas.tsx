"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import { skillGroups } from "@/components/skills/skills-data";

const GROUP_COLORS = ["#1d4b3f", "#a2320f", "#5b4bd4"]; // forest, vermilion-ink, iris

type ChipDef = {
  label: string;
  color: string;
  home: [number, number];
  width: number;
};

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const o = new MutationObserver(update);
    o.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);
  return isDark;
}

/** One draggable, throwable chip with an idle pull back toward its grid home. */
function Chip({
  def,
  resetSignal,
  paused,
}: {
  def: ChipDef;
  resetSignal: number;
  paused: boolean;
}) {
  const body = useRef<RapierRigidBody>(null);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0, t: 0, vx: 0, vy: 0 });
  const idleTimer = useRef(0);

  useEffect(() => {
    // reset: teleport back to grid home
    const b = body.current;
    if (!b) return;
    b.setTranslation({ x: def.home[0], y: def.home[1], z: 0 }, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
  }, [resetSignal, def.home]);

  const onDown = (e: { stopPropagation: () => void; point: THREE.Vector3; pointerId?: number; target?: Element }) => {
    e.stopPropagation();
    dragging.current = true;
    lastPointer.current.t = performance.now();
    lastPointer.current.x = e.point.x;
    lastPointer.current.y = e.point.y;
    const b = body.current;
    if (b) b.setBodyType(2, true); // kinematicPositionBased
    if (e.pointerId != null && e.target && "setPointerCapture" in e.target) {
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const onMove = (e: { point: THREE.Vector3 }) => {
    if (!dragging.current || !body.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastPointer.current.t) / 1000;
    lastPointer.current.vx = (e.point.x - lastPointer.current.x) / dt;
    lastPointer.current.vy = (e.point.y - lastPointer.current.y) / dt;
    lastPointer.current.x = e.point.x;
    lastPointer.current.y = e.point.y;
    lastPointer.current.t = now;
    body.current.setNextKinematicTranslation({ x: e.point.x, y: e.point.y, z: 0 });
  };

  const onUp = () => {
    if (!dragging.current || !body.current) return;
    dragging.current = false;
    const b = body.current;
    b.setBodyType(0, true); // dynamic
    // Throw the chip: translate the captured drag velocity into an impulse
    // so the release has real momentum. Clamped so a hard flick cannot
    // launch a chip off-stage or spike the solver.
    const clamp = (v: number) => Math.max(-10, Math.min(10, v));
    const vx = clamp(lastPointer.current.vx);
    const vy = clamp(lastPointer.current.vy);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.applyImpulse({ x: vx * 0.9, y: vy * 0.9, z: 0 }, true);
    // a little spin from the throw direction for life
    b.applyTorqueImpulse({ x: 0, y: 0, z: -vx * 0.04 }, true);
    idleTimer.current = 0;
  };

  // idle attractor: after a moment of no dragging, gently pull home
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    const tick = () => {
      const b = body.current;
      if (b && !dragging.current) {
        const t = b.translation();
        const dx = def.home[0] - t.x;
        const dy = def.home[1] - t.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.05) {
          // soft spring impulse, stronger the longer it has been idle
          const k = 0.0016 * Math.min(3, 1 + idleTimer.current * 0.02);
          b.applyImpulse({ x: dx * k, y: dy * k, z: -t.z * 0.002 }, true);
          const lv = b.linvel();
          b.setLinvel({ x: lv.x * 0.92, y: lv.y * 0.92, z: lv.z * 0.9 }, true);
          idleTimer.current += 1;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [def.home, paused]);

  const half = def.width / 2;
  return (
    <RigidBody
      ref={body}
      position={[def.home[0], def.home[1], 0]}
      colliders={false}
      linearDamping={0.6}
      angularDamping={0.8}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <CuboidCollider args={[half, 0.28, 0.2]} />
      <mesh
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        <boxGeometry args={[def.width, 0.56, 0.34]} />
        <meshStandardMaterial color={def.color} roughness={0.5} metalness={0.05} />
      </mesh>
      <Text
        position={[0, 0, 0.19]}
        fontSize={0.2}
        maxWidth={def.width - 0.2}
        textAlign="center"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {def.label}
      </Text>
    </RigidBody>
  );
}

export default function SkillsPhysicsCanvas({ resetSignal }: { resetSignal: number }) {
  const isDark = useIsDark();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  // Mount the canvas only when near the viewport; unmount when far so the
  // WebGL context is released.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setNear(e.isIntersecting)),
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    const ioActive = new IntersectionObserver((entries) =>
      entries.forEach((e) => setActive(e.isIntersecting))
    );
    ioActive.observe(el);
    return () => {
      io.disconnect();
      ioActive.disconnect();
    };
  }, []);

  // Lay the chips out in three tidy columns (their idle "grid home").
  const chips = useMemo<ChipDef[]>(() => {
    const defs: ChipDef[] = [];
    const colX = [-3.4, 0, 3.4];
    skillGroups.forEach((group, gi) => {
      const all = [group.label, ...group.items];
      const rows = all.length;
      const topY = ((rows - 1) / 2) * 0.78;
      all.forEach((label, ri) => {
        const width = Math.min(3.0, Math.max(1.2, label.length * 0.13 + 0.5));
        defs.push({
          label,
          color: GROUP_COLORS[gi],
          home: [colX[gi] + (Math.random() - 0.5) * 0.2, topY - ri * 0.78],
          width,
        });
      });
    });
    return defs;
  }, []);

  return (
    <div className="skills-canvas-wrap" ref={wrapRef} aria-hidden="true">
      {near && (
        <Canvas
          dpr={[1, 1.75]}
          frameloop={active ? "always" : "demand"}
          orthographic
          camera={{ position: [0, 0, 12], zoom: 58 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        >
          <ambientLight intensity={isDark ? 1.1 : 1.4} />
          <directionalLight position={[3, 5, 6]} intensity={1.4} />
          <Physics gravity={[0, -5.5, 0]} paused={!active}>
            {/* invisible walls keep the chips on stage */}
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[8, 0.3, 1]} position={[0, -5, 0]} />
              <CuboidCollider args={[8, 0.3, 1]} position={[0, 5, 0]} />
              <CuboidCollider args={[0.3, 6, 1]} position={[-6.4, 0, 0]} />
              <CuboidCollider args={[0.3, 6, 1]} position={[6.4, 0, 0]} />
            </RigidBody>
            {chips.map((c, i) => (
              <Chip key={i} def={c} resetSignal={resetSignal} paused={!active} />
            ))}
          </Physics>
        </Canvas>
      )}
    </div>
  );
}
