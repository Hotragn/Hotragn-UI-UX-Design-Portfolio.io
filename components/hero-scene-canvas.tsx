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
  attribute vec3 aTarget;   // rest position in the shape
  attribute float aSeed;
  varying float vMix;       // 0 at rest, 1 fully displaced
  varying float vSeed;

  // cheap 3D hash noise
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 pos = aTarget;

    // gentle idle drift so the field breathes at rest
    float drift = sin(uTime * 0.6 + aSeed * 6.2831) * 0.06;
    pos += vec3(drift, drift * 0.7, drift * 0.4);

    // pointer repulsion in the xy plane, softened by distance
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse);
    float influence = smoothstep(1.6, 0.0, d) * (0.5 + uMouseVel);
    vec2 push = normalize(toMouse + 0.0001) * influence * 1.1;
    pos.xy += push;

    // curl-ish wobble scaled by how displaced we are
    float n = hash(aTarget * 1.5 + uTime * 0.15);
    pos.z += (n - 0.5) * influence * 1.2;

    vMix = clamp(influence, 0.0, 1.0);
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (1.0 + vMix * 0.8) * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA; // vermilion
  uniform vec3 uColorB; // plum
  uniform vec3 uColorC; // iris
  uniform float uOpacity;
  varying float vMix;
  varying float vSeed;

  void main() {
    // round, soft-edged point
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, dist);

    // color along the brand gradient, biased by displacement + seed
    float t = clamp(vSeed * 0.6 + vMix * 0.5, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.5, t));
    col = mix(col, uColorC, smoothstep(0.5, 1.0, t));

    // subtle chromatic lift when displaced
    col += vMix * 0.12;

    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

function ParticleField({ isDark }: { isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Adaptive particle budget: desktop dense, narrow screens light.
  const count = useMemo(() => {
    if (typeof window === "undefined") return 9000;
    return window.innerWidth < 900 ? 4000 : 20000;
  }, []);

  const { positions, targets, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    // Rest shape: a soft fibonacci-distributed sphere shell with jitter,
    // an abstract on-palette ambience rather than a literal wordmark.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitter = 0.85 + Math.random() * 0.35;
      const radius = 2.1 * jitter;
      const tx = Math.cos(theta) * r * radius;
      const ty = y * radius * 0.9;
      const tz = Math.sin(theta) * r * radius;
      targets[i * 3] = tx;
      targets[i * 3 + 1] = ty;
      targets[i * 3 + 2] = tz;
      // start scattered, will ease toward target via the shader's rest pos
      positions[i * 3] = tx;
      positions[i * 3 + 1] = ty;
      positions[i * 3 + 2] = tz;
      seeds[i] = Math.random();
    }
    return { positions, targets, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseVel: { value: 0 },
      uSize: { value: 2.2 },
      uOpacity: { value: isDark ? 0.85 : 0.7 },
      uColorA: { value: new THREE.Color(isDark ? "#ff6a3f" : "#d0431d") },
      uColorB: { value: new THREE.Color(isDark ? "#e070bd" : "#b23a8a") },
      uColorC: { value: new THREE.Color(isDark ? "#a99bff" : "#5b4bd4") },
    }),
    // colors set once; theme changes handled in the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uOpacity.value = isDark ? 0.85 : 0.7;
    u.uColorA.value.set(isDark ? "#ff6a3f" : "#d0431d");
    u.uColorB.value.set(isDark ? "#e070bd" : "#b23a8a");
    u.uColorC.value.set(isDark ? "#a99bff" : "#5b4bd4");
  }, [isDark]);

  // pointer tracking with velocity, projected to the particle plane
  const pointer = useRef({ x: 999, y: 999, px: 999, py: 999, vel: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      const p = pointer.current;
      // world span roughly matches camera framing
      const wx = nx * 3.2;
      const wy = ny * 2.2;
      p.vel = Math.min(1, Math.hypot(wx - p.x, wy - p.y) * 1.6);
      p.px = p.x;
      p.py = p.y;
      p.x = wx;
      p.y = wy;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!matRef.current || !pointsRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uMouse.value.set(pointer.current.x, pointer.current.y);
    // decay velocity so displaced particles spring back (uMouseVel -> 0)
    pointer.current.vel *= 0.9;
    u.uMouseVel.value = THREE.MathUtils.lerp(u.uMouseVel.value, pointer.current.vel, 0.2);
    // slow overall rotation
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x = Math.sin(u.uTime.value * 0.1) * 0.08;
  });

  // scale down slightly on small viewports so it reads as ambience
  const groupScale = size.width < 900 ? 0.8 : 1;

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
        blending={THREE.AdditiveBlending}
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
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ParticleField isDark={isDark} />
      </Canvas>
    </div>
  );
}
