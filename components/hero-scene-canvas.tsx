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
  uniform vec2 uMouseVec;   // pointer velocity vector (world units/frame-ish)
  uniform float uMouseVel;  // pointer speed magnitude, 0..1
  uniform float uSize;
  attribute vec3 aTarget;   // rest position
  attribute float aSeed;
  varying float vMix;       // 0 at rest, 1 fully displaced
  varying float vSeed;

  // --- simplex-derived curl noise (Ashima simplex 3D) ---
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  // 2D curl from the simplex noise potential field
  vec2 curl(vec2 p){
    float e = 0.1;
    float n1 = snoise(vec3(p.x, p.y + e, uTime * 0.06));
    float n2 = snoise(vec3(p.x, p.y - e, uTime * 0.06));
    float n3 = snoise(vec3(p.x + e, p.y, uTime * 0.06));
    float n4 = snoise(vec3(p.x - e, p.y, uTime * 0.06));
    return vec2(n1 - n2, n4 - n3) / (2.0 * e);
  }

  void main() {
    vec3 pos = aTarget;

    // organic idle drift along a curl-noise field, kept small so the
    // field breathes without forming a mass
    vec2 flow = curl(aTarget.xy * 0.35 + aSeed * 3.0);
    pos.xy += flow * 0.06;

    // pointer interaction: repel from the cursor, and add a gentle push
    // along the cursor's velocity vector so fast moves streak the dust.
    // The velocity term is clamped in JS so it never spikes.
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse);
    float influence = smoothstep(1.4, 0.0, d) * (0.4 + uMouseVel);
    pos.xy += normalize(toMouse + 0.0001) * influence * 0.7;
    pos.xy += uMouseVec * influence * 0.35;

    vMix = clamp(influence, 0.0, 1.0);
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
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
    // round dust mote with a soft, distance-based alpha taper so points
    // fade smoothly into the background instead of clipping at the edge
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float alpha = smoothstep(0.5, 0.0, dist);
    alpha = pow(alpha, 1.6); // ease the falloff so the core stays soft

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
      uMouseVec: { value: new THREE.Vector2(0, 0) },
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

  const pointer = useRef({ x: 999, y: 999, vx: 0, vy: 0, vel: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      const wx = nx * 3.6;
      const wy = ny * 2.4;
      const p = pointer.current;
      // velocity vector, clamped so a fast flick never spikes the frame
      const clamp = (v: number) => Math.max(-1.2, Math.min(1.2, v));
      p.vx = clamp(wx - p.x);
      p.vy = clamp(wy - p.y);
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
    const p = pointer.current;
    u.uMouse.value.set(p.x, p.y);
    // decay the velocity so displaced dust springs back to rest
    p.vx *= 0.86;
    p.vy *= 0.86;
    p.vel *= 0.9;
    u.uMouseVec.value.set(p.vx, p.vy);
    u.uMouseVel.value = THREE.MathUtils.lerp(u.uMouseVel.value, p.vel, 0.2);
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
