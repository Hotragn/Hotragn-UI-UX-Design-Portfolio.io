"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/** Watch the .dark class on <html> so the palette matches the active theme. */
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

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;      // world-space pointer
  uniform float uMouseVel;  // pointer speed, 0..1
  uniform float uSize;
  attribute vec3 aTarget;   // rest position
  attribute float aSeed;
  varying float vMix;       // 0 at rest, 1 fully displaced
  varying float vSeed;

  void main() {
    vec3 pos = aTarget;

    // slow idle drift so the dust breathes, kept tiny
    pos.x += sin(uTime * 0.4 + aSeed * 6.2831) * 0.05;
    pos.y += cos(uTime * 0.32 + aSeed * 4.0) * 0.05;

    // soft pointer repulsion in the plane
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse);
    float influence = smoothstep(1.4, 0.0, d) * (0.4 + uMouseVel);
    pos.xy += normalize(toMouse + 0.0001) * influence * 0.7;

    vMix = clamp(influence, 0.0, 1.0);
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    // small, roughly constant point size (gentle perspective)
    gl_PointSize = uSize * (0.9 + vMix * 0.5) * (220.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying float vMix;
  varying float vSeed;

  void main() {
    // round, soft dust mote
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist);

    float t = clamp(vSeed, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.5, t));
    col = mix(col, uColorC, smoothstep(0.5, 1.0, t));

    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

function ParticleField({ isDark }: { isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Sparse, ambient budget: dust, not a mass.
  const count = useMemo(() => {
    if (typeof window === "undefined") return 3500;
    return window.innerWidth < 900 ? 2500 : 5000;
  }, []);

  const { positions, targets, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    // Wide, flat scatter biased to the right half and edges of the frame,
    // so it reads as evenly-spread dust and never sits under the
    // left-aligned headline. No sphere or disc.
    for (let i = 0; i < count; i++) {
      // bias x toward the right: roughly -1.5 .. 5.5
      const x = -1.5 + Math.pow(Math.random(), 0.7) * 7;
      const y = (Math.random() - 0.5) * 6.5;
      const z = (Math.random() - 0.5) * 3.5 - 0.5; // mostly behind the plane
      targets[i * 3] = x;
      targets[i * 3 + 1] = y;
      targets[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      seeds[i] = Math.random();
    }
    return { positions, targets, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseVel: { value: 0 },
      uSize: { value: 1.6 },
      uOpacity: { value: isDark ? 0.3 : 0.26 },
      uColorA: { value: new THREE.Color(isDark ? "#ff6a3f" : "#d0431d") },
      uColorB: { value: new THREE.Color(isDark ? "#e070bd" : "#b23a8a") },
      uColorC: { value: new THREE.Color(isDark ? "#a99bff" : "#5b4bd4") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uOpacity.value = isDark ? 0.3 : 0.26;
    u.uColorA.value.set(isDark ? "#ff6a3f" : "#d0431d");
    u.uColorB.value.set(isDark ? "#e070bd" : "#b23a8a");
    u.uColorC.value.set(isDark ? "#a99bff" : "#5b4bd4");
  }, [isDark]);

  const pointer = useRef({ x: 999, y: 999, vel: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      const wx = nx * 3.6;
      const wy = ny * 2.4;
      const p = pointer.current;
      p.vel = Math.min(1, Math.hypot(wx - p.x, wy - p.y) * 1.2);
      p.x = wx;
      p.y = wy;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_state, delta) => {
    if (!matRef.current || !pointsRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uMouse.value.set(pointer.current.x, pointer.current.y);
    pointer.current.vel *= 0.9;
    u.uMouseVel.value = THREE.MathUtils.lerp(u.uMouseVel.value, pointer.current.vel, 0.2);
    // very slow drift, no visible rotation of a mass
    pointsRef.current.rotation.z = Math.sin(u.uTime.value * 0.05) * 0.03;
  });

  const groupScale = size.width < 900 ? 0.9 : 1;

  return (
    <points ref={pointsRef} scale={groupScale}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[targets, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function HeroSceneCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const isDark = useIsDark();

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
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ParticleField isDark={isDark} />
      </Canvas>
    </div>
  );
}
