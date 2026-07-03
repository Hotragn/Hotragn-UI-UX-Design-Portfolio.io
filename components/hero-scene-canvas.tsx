"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Line, Float } from "@react-three/drei";
import { gsap } from "gsap";

/** Watch the .dark class on <html> so the studio void matches the theme. */
function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const ACCENTS = ["#d0431d", "#b23a8a", "#5b4bd4"]; // vermilion, plum, iris

/**
 * A frosted glass panel: a rounded box with a translucent physical
 * material (faux-glass, cheaper than MeshTransmissionMaterial) plus a
 * slightly larger neon edge box behind it for the emissive rim. Snaps in
 * on mount, then floats.
 */
function GlassPanel({
  position,
  size,
  accent,
  delay,
  reduced,
}: {
  position: [number, number, number];
  size: [number, number, number];
  accent: string;
  delay: number;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    const g = group.current;
    if (!g || reduced) return;
    // elegant one-time snap-into-place stagger
    gsap.fromTo(
      g.position,
      { z: position[2] - 2.2 },
      { z: position[2], duration: 1.1, ease: "power3.out", delay }
    );
    gsap.fromTo(
      g.scale,
      { x: 0.6, y: 0.6, z: 0.6 },
      { x: 1, y: 1, z: 1, duration: 1.0, ease: "back.out(1.5)", delay }
    );
  }, [position, delay, reduced]);

  return (
    <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.15} floatIntensity={reduced ? 0 : 0.5}>
      <group ref={group} position={position}>
        {/* neon accent edge, slightly larger and behind the glass */}
        <RoundedBox args={[size[0] + 0.06, size[1] + 0.06, size[2]]} radius={0.09} smoothness={4} position={[0, 0, -0.02]}>
          <meshBasicMaterial color={accent} transparent opacity={0.5} />
        </RoundedBox>
        {/* frosted glass face */}
        <RoundedBox args={size} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#20203a"
            roughness={0.35}
            metalness={0.1}
            transmission={0.5}
            thickness={0.6}
            ior={1.2}
            transparent
            opacity={0.55}
            emissive={accent}
            emissiveIntensity={0.06}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

/** A tiny bar graph on one panel, bars pulse gently. */
function MiniGraph({ position, reduced }: { position: [number, number, number]; reduced: boolean }) {
  const bars = useRef<THREE.Group>(null);
  const heights = useMemo(() => [0.28, 0.5, 0.38, 0.62, 0.44], []);
  useFrame((state) => {
    if (!bars.current || reduced) return;
    bars.current.children.forEach((bar, i) => {
      const b = bar as THREE.Mesh;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4 + i * 0.7) * 0.14;
      b.scale.y = pulse;
      b.position.y = (heights[i] * pulse) / 2;
    });
  });
  return (
    <group position={position} ref={bars}>
      {heights.map((h, i) => (
        <mesh key={i} position={[(i - 2) * 0.16, h / 2, 0.06]}>
          <boxGeometry args={[0.1, h, 0.02]} />
          <meshBasicMaterial color={ACCENTS[i % 3]} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** A small node network with a pulse traveling along the links. */
function NodeNetwork({ reduced }: { reduced: boolean }) {
  const nodes = useMemo<[number, number, number][]>(
    () => [
      [-1.1, 0.5, 0],
      [-0.4, 1.0, 0.2],
      [0.5, 0.7, -0.1],
      [1.1, 0.1, 0.1],
      [0.3, -0.5, 0],
      [-0.6, -0.3, 0.2],
      [-1.2, -0.8, -0.1],
      [0.9, -0.9, 0],
    ],
    []
  );
  const links = useMemo(
    () => [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [5, 6],
      [4, 7],
      [2, 4],
    ],
    []
  );
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    if (reduced) return;
    const t = (state.clock.elapsedTime * 0.35) % 1;
    links.forEach((lk, i) => {
      const m = pulseRefs.current[i];
      if (!m) return;
      const a = nodes[lk[0]];
      const b = nodes[lk[1]];
      const phase = (t + i * 0.11) % 1;
      m.position.set(
        a[0] + (b[0] - a[0]) * phase,
        a[1] + (b[1] - a[1]) * phase,
        a[2] + (b[2] - a[2]) * phase
      );
    });
  });
  return (
    <group position={[0, 0, -0.5]}>
      {links.map((lk, i) => (
        <Line
          key={`l${i}`}
          points={[nodes[lk[0]], nodes[lk[1]]]}
          color="#8a7fd0"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
      {nodes.map((n, i) => (
        <mesh key={`n${i}`} position={n}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={ACCENTS[i % 3]} transparent opacity={0.9} />
        </mesh>
      ))}
      {!reduced &&
        links.map((_, i) => (
          <mesh
            key={`p${i}`}
            ref={(el) => {
              pulseRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
        ))}
    </group>
  );
}

/** The whole scene, parallaxing to the cursor via GSAP quickTo (clamped). */
function Scene({ isDark, panelCount, reduced }: { isDark: boolean; panelCount: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!group.current || reduced) return;
    const rotY = gsap.quickTo(group.current.rotation, "y", { duration: 0.9, ease: "power3" });
    const rotX = gsap.quickTo(group.current.rotation, "x", { duration: 0.9, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // clamp the parallax so a fast flick never swings the scene hard
      rotY(THREE.MathUtils.clamp(nx * 0.18, -0.22, 0.22));
      rotX(THREE.MathUtils.clamp(ny * 0.12, -0.15, 0.15));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // slow continuous orbit on the group (small amplitude, eased loop)
  useFrame((state) => {
    if (!group.current || reduced) return;
    const t = state.clock.elapsedTime;
    group.current.position.x = Math.sin(t * 0.12) * 0.25;
    group.current.position.y = Math.cos(t * 0.09) * 0.15;
  });

  const panels = useMemo(() => {
    const all: { position: [number, number, number]; size: [number, number, number]; accent: string }[] = [
      { position: [2.1, 0.6, 0], size: [1.7, 1.1, 0.08], accent: ACCENTS[1] },
      { position: [3.0, -0.9, -1.2], size: [1.2, 0.85, 0.08], accent: ACCENTS[2] },
      { position: [1.3, -1.3, -0.6], size: [1.0, 0.7, 0.08], accent: ACCENTS[0] },
      { position: [3.4, 1.2, -1.8], size: [0.9, 0.6, 0.08], accent: ACCENTS[2] },
      { position: [1.6, 1.6, -1.0], size: [0.8, 0.55, 0.08], accent: ACCENTS[0] },
    ];
    return all.slice(0, panelCount);
  }, [panelCount]);

  return (
    <>
      {/* fake shallow DoF: fog fades far panels into the void */}
      <fog attach="fog" args={[isDark ? "#100b1d" : "#171226", 5.5, 12]} />
      <ambientLight intensity={isDark ? 0.5 : 0.7} />
      <directionalLight position={[4, 4, 5]} intensity={1.2} color="#fff4ee" />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#9a8cff" />
      <group ref={group}>
        {panels.map((p, i) => (
          <GlassPanel
            key={i}
            position={p.position}
            size={p.size}
            accent={p.accent}
            delay={0.15 + i * 0.12}
            reduced={reduced}
          />
        ))}
        {/* mini graph rides on the first, largest panel */}
        <MiniGraph position={[2.1, 0.45, 0.08]} reduced={reduced} />
        <NodeNetwork reduced={reduced} />
      </group>
    </>
  );
}

export default function HeroSceneCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const isDark = useIsDark();

  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [panelCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 900 ? 3 : 5
  );

  // Pause the render loop entirely when the hero scrolls out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true" ref={wrapRef}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <Scene isDark={isDark} panelCount={panelCount} reduced={reduced} />
      </Canvas>
    </div>
  );
}
