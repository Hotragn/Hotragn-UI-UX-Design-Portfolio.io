"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

/** Watch the .dark class on <html> so the fog matches the active theme. */
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

function Blob({
  position,
  scale,
  color,
  distort,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  distort: number;
  speed: number;
}) {
  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 48]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

/** Subtle mouse parallax on the whole group. */
function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const x = state.pointer.x * 0.28;
    const y = state.pointer.y * 0.18;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y, 0.05);
  });
  return <group ref={group}>{children}</group>;
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

  const fogColor = isDark ? "#171226" : "#faf6ef";

  return (
    <div className="hero-scene" aria-hidden="true" ref={wrapRef}>
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <fog attach="fog" args={[fogColor, 5.5, 11]} />
        <ambientLight intensity={isDark ? 0.5 : 1.1} />
        {/* brand gradient as light: vermilion, plum, iris */}
        <pointLight position={[6, 3, 4]} intensity={60} color="#d0431d" />
        <pointLight position={[-5, -2, 3]} intensity={50} color="#5b4bd4" />
        <pointLight position={[0, 5, -3]} intensity={40} color="#b23a8a" />
        <ParallaxGroup>
          <Blob
            position={[2.4, 0.4, -1]}
            scale={1.7}
            color={isDark ? "#2c2350" : "#f3ecdf"}
            distort={0.38}
            speed={1.4}
          />
          <Blob
            position={[-2.8, -1.4, -2]}
            scale={1.1}
            color={isDark ? "#241c42" : "#e4ede7"}
            distort={0.3}
            speed={1.1}
          />
        </ParallaxGroup>
      </Canvas>
    </div>
  );
}
