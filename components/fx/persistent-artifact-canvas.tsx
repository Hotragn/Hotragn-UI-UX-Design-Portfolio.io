"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ARTIFACT, EASE } from "@/lib/motion";
import { isGLBusy, subscribeGL } from "@/components/fx/gl-lock";

gsap.registerPlugin(ScrollTrigger);

/**
 * The persistent site artifact
 * ============================
 * One low-poly glass icosahedron and three small companions, fixed
 * behind the homepage, travelling from section to section as you scroll.
 * It is the only 3D object on the page now: the old hero-only panel
 * scene is gone.
 *
 * Cheap on purpose. Under 100 triangles, no post-processing, no shadows,
 * no transmission (which would cost a whole extra render target), DPR
 * capped at 1.5, and a demand-driven render loop. See the notes on
 * `frameloop` further down.
 */

/** The signature gradient, light theme then dark theme. */
const ACCENTS_LIGHT = ["#d0431d", "#b23a8a", "#5b4bd4"]; // vermilion, plum, iris
const ACCENTS_DARK = ["#ff6a3f", "#e070bd", "#a99bff"];

type Pose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
  /** 0 = vermilion, 0.5 = plum, 1 = iris. The light travels the gradient. */
  hue: number;
};

/**
 * The choreography map. One stop per major band of the homepage, in
 * document order. Between two stops the object is tweened with a
 * scrubbed ScrollTrigger, so the travel is coupled to the wheel rather
 * than played back on a timer.
 *
 * The camera sits at z 7 with a 40 degree vertical field of view, so at
 * z 0 the frame is roughly 9 units wide and 5 tall: x beyond about 4.5
 * is off-stage, y beyond about 2.5 is off the top or bottom.
 *
 * `ry` climbs monotonically through the whole page (0.5 to 7.2 radians,
 * a little over one full turn) so the object never appears to rewind.
 */
const STOPS: { sel: string; pose: Pose }[] = [
  // Hero: present and to the right of the headline, closest to camera.
  { sel: ".hero", pose: { x: 2.15, y: 0.25, z: 0, rx: 0.35, ry: 0.5, rz: 0.06, s: 1.05, hue: 0 } },
  // Selected work: swings left and drops back behind the case cards.
  { sel: "#work", pose: { x: -2.7, y: -0.45, z: -1.8, rx: -0.25, ry: 1.5, rz: -0.22, s: 0.8, hue: 0.16 } },
  // Experience: climbs to the top right, alongside the timeline spine.
  { sel: "#experience", pose: { x: 3.1, y: 1.25, z: -1, rx: 0.55, ry: 2.5, rz: 0.3, s: 0.66, hue: 0.32 } },
  // Process: sinks low and swells under the dark room.
  { sel: "#process", pose: { x: -0.35, y: -1.55, z: -2.6, rx: -0.6, ry: 3.6, rz: -0.12, s: 1.5, hue: 0.5 } },
  // Interaction design: small and upright at the right edge, beside the device.
  { sel: "#onboarding", pose: { x: 3.35, y: 0.15, z: -0.4, rx: 0.15, ry: 4.5, rz: 0.04, s: 0.58, hue: 0.64 } },
  // Frameworks: back to the left, level with the methodology cards.
  { sel: "#systems", pose: { x: -3.05, y: 0.7, z: -1.3, rx: -0.45, ry: 5.4, rz: -0.3, s: 0.92, hue: 0.78 } },
  // About: retreats far back, clearing the stage for the skills playground.
  { sel: "#about", pose: { x: -3.8, y: -0.9, z: -4.2, rx: 0.3, ry: 6.2, rz: 0.18, s: 0.5, hue: 0.88 } },
  // Contact: returns to the centre, nearest and largest, squared up to you.
  { sel: "#contact", pose: { x: 0, y: -0.15, z: 1.1, rx: 0, ry: 7.2, rz: 0, s: 1.3, hue: 1 } },
];

/** Watch the .dark class on <html> so the lighting matches the theme. */
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

/** Sample the three-stop brand gradient at t in [0, 1]. */
function sampleAccent(target: THREE.Color, stops: THREE.Color[], t: number) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1) * 2;
  const i = Math.min(1, Math.floor(clamped));
  target.copy(stops[i]).lerp(stops[i + 1], clamped - i);
}

function Artifact({
  isDark,
  paused,
  returning,
}: {
  isDark: boolean;
  paused: boolean;
  returning: boolean;
}) {
  const { invalidate } = useThree();
  const group = useRef<THREE.Group>(null);
  const satellites = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const fillLight = useRef<THREE.DirectionalLight>(null);
  const shell = useRef<THREE.MeshPhysicalMaterial>(null);
  const edges = useRef<THREE.LineBasicMaterial>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);

  // The pose the scroll choreography writes into, and the arrival
  // progress the entrance tween writes into. Plain objects so GSAP can
  // tween them without touching React state (no re-renders per frame).
  const pose = useRef<Pose>({ ...STOPS[0].pose });
  const enter = useRef({ t: 0 });

  const geo = useMemo(() => {
    const hull = new THREE.IcosahedronGeometry(1, 0);
    return {
      hull,
      edges: new THREE.EdgesGeometry(hull),
      core: new THREE.IcosahedronGeometry(0.46, 0),
      satellite: new THREE.TetrahedronGeometry(0.19, 0),
    };
  }, []);
  useEffect(() => {
    const g = geo;
    return () => {
      g.hull.dispose();
      g.edges.dispose();
      g.core.dispose();
      g.satellite.dispose();
    };
  }, [geo]);

  const palette = useMemo(
    () => (isDark ? ACCENTS_DARK : ACCENTS_LIGHT).map((c) => new THREE.Color(c)),
    [isDark]
  );
  const scratch = useMemo(() => new THREE.Color(), []);

  // ---- Entrance -----------------------------------------------------
  // The object arrives once: scale and opacity up from nothing with the
  // house ease, unwinding a little extra rotation as it settles. A
  // returning visitor gets the brisk version (see the adaptive note in
  // persistent-artifact.tsx).
  useEffect(() => {
    const tween = gsap.to(enter.current, {
      t: 1,
      duration: returning ? ARTIFACT.enterDurationReturning : ARTIFACT.enterDuration,
      delay: returning ? ARTIFACT.enterDelayReturning : ARTIFACT.enterDelay,
      ease: EASE.out,
      onUpdate: invalidate,
      onComplete: invalidate,
    });
    return () => {
      tween.kill();
    };
  }, [invalidate, returning]);

  // ---- Scroll choreography ------------------------------------------
  // One scrubbed fromTo per pair of neighbouring stops, spanning from
  // "this section's top reaches the middle of the screen" to "the next
  // one does". Because each tween's `from` is the previous tween's `to`,
  // the clamped value at either edge of a range always agrees with its
  // neighbour, so the object has exactly one defined pose at any scroll
  // position, including on a refresh or a deep link.
  useEffect(() => {
    const nodes = STOPS.map((stop) => ({
      el: document.querySelector<HTMLElement>(stop.sel),
      pose: stop.pose,
    })).filter((n): n is { el: HTMLElement; pose: Pose } => Boolean(n.el));
    if (nodes.length < 2) return;

    const ctx = gsap.context(() => {
      for (let i = 0; i < nodes.length - 1; i += 1) {
        gsap.fromTo(pose.current, { ...nodes[i].pose }, {
          ...nodes[i + 1].pose,
          ease: EASE.none,
          immediateRender: false,
          onUpdate: invalidate,
          scrollTrigger: {
            trigger: nodes[i].el,
            start: "top center",
            endTrigger: nodes[i + 1].el,
            end: "top center",
            scrub: ARTIFACT.scrub,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    ScrollTrigger.refresh();
    invalidate();
    return () => ctx.revert();
  }, [invalidate]);

  // ---- Demand-driven render loop ------------------------------------
  // frameloop is "demand" on the Canvas, so nothing renders unless
  // somebody asks. Scroll asks (every scrub update calls invalidate),
  // the entrance asks, and this slow heartbeat asks so the ambient
  // rotation keeps breathing on a page nobody is touching. At 120ms that
  // is roughly 8 renders a second of a sub-100-triangle scene; the
  // rotation is slow enough (0.05 rad/s) that 8fps and 60fps look the
  // same. The heartbeat stops entirely when the tab is hidden or the
  // skills playground has claimed the GL lock.
  useEffect(() => {
    if (paused) return;
    let id = 0;
    const start = () => {
      if (id) return;
      id = window.setInterval(invalidate, ARTIFACT.idleTickMs);
    };
    const stop = () => {
      if (!id) return;
      window.clearInterval(id);
      id = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [invalidate, paused]);

  // One frame on resume, so the object is repainted at whatever pose the
  // scroll moved to while the loop was parked.
  useEffect(() => {
    if (!paused) invalidate();
  }, [paused, invalidate]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = pose.current;
    const e = enter.current.t;
    const time = state.clock.elapsedTime;

    g.position.set(p.x, p.y, p.z);
    // ambient drift on top of the scroll-driven rotation, plus the last
    // of the entrance spin unwinding
    g.rotation.set(
      p.rx,
      p.ry + time * ARTIFACT.idleSpin + (1 - e) * 1.5,
      p.rz
    );
    g.scale.setScalar(p.s * e);

    if (satellites.current) {
      satellites.current.rotation.y = -time * ARTIFACT.satelliteSpin;
      satellites.current.rotation.x = Math.sin(time * 0.11) * 0.35;
    }

    sampleAccent(scratch, palette, p.hue);
    if (keyLight.current) keyLight.current.color.copy(scratch);
    if (edges.current) {
      edges.current.color.copy(scratch);
      edges.current.opacity = (isDark ? 0.72 : 0.6) * e;
    }
    if (coreMat.current) {
      coreMat.current.color.copy(scratch);
      coreMat.current.opacity = (isDark ? 0.34 : 0.28) * e;
    }
    if (shell.current) {
      shell.current.opacity = (isDark ? 0.3 : 0.24) * e;
    }
    if (fillLight.current) {
      // the fill runs the gradient in the opposite direction, so the two
      // ends of the brand ramp are always both present on the object
      sampleAccent(scratch, palette, 1 - p.hue);
      fillLight.current.color.copy(scratch);
    }
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.85 : 1.05} />
      <directionalLight ref={keyLight} position={[3.5, 3, 5]} intensity={2.4} />
      <directionalLight ref={fillLight} position={[-4, -1.5, 2]} intensity={1.3} />
      <directionalLight position={[0, 4, -5]} intensity={0.8} color="#ffffff" />

      <group ref={group} scale={0}>
        {/* faceted glass shell */}
        <mesh geometry={geo.hull}>
          <meshPhysicalMaterial
            ref={shell}
            flatShading
            color={isDark ? "#2a2140" : "#f6f1e6"}
            roughness={0.12}
            metalness={0.02}
            clearcoat={1}
            clearcoatRoughness={0.16}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* the facet edges, drawn in whatever colour the page is at */}
        <lineSegments geometry={geo.edges}>
          <lineBasicMaterial ref={edges} transparent opacity={0} depthWrite={false} />
        </lineSegments>
        {/* a small solid core, so the glass has something to refract */}
        <mesh geometry={geo.core}>
          <meshBasicMaterial ref={coreMat} transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* three companions, orbiting slowly on their own axis */}
        <group ref={satellites}>
          <mesh geometry={geo.satellite} position={[1.75, 0.55, 0.3]}>
            <meshBasicMaterial color={palette[0]} transparent opacity={0.5} depthWrite={false} />
          </mesh>
          <mesh geometry={geo.satellite} position={[-1.6, -0.9, 0.6]}>
            <meshBasicMaterial color={palette[1]} transparent opacity={0.45} depthWrite={false} />
          </mesh>
          <mesh geometry={geo.satellite} position={[0.4, -1.85, -0.5]}>
            <meshBasicMaterial color={palette[2]} transparent opacity={0.42} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function PersistentArtifactCanvas({ returning }: { returning: boolean }) {
  const isDark = useIsDark();
  const [busy, setBusy] = useState(() => isGLBusy());

  // Yield to the skills physics playground: while it holds the lock this
  // canvas renders nothing at all and fades out of the way.
  useEffect(() => {
    setBusy(isGLBusy());
    return subscribeGL(setBusy);
  }, []);

  return (
    <div
      className={`site-artifact${busy ? " is-yielded" : ""}`}
      aria-hidden="true"
      data-gl-paused={busy ? "true" : "false"}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={busy ? "never" : "demand"}
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <Artifact isDark={isDark} paused={busy} returning={returning} />
      </Canvas>
    </div>
  );
}
