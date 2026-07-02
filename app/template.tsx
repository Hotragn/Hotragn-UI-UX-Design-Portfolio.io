"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollFx } from "@/components/fx/scroll-fx";

/**
 * Route transition: a gradient curtain sweeps up over the viewport and
 * out the top while the incoming page swaps in behind it. Runs on every
 * template mount (initial load and client navigations). Reduced motion
 * falls back to the previous short fade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [curtainDone, setCurtainDone] = useState(false);

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <ScrollFx />
        {children}
      </motion.div>
    );
  }

  return (
    <>
      {!curtainDone && (
        <motion.div
          className="route-curtain"
          aria-hidden="true"
          initial={{ y: "104%" }}
          animate={{ y: ["104%", "0%", "-104%"] }}
          transition={{ duration: 0.45, times: [0, 0.5, 1], ease: ["easeIn", "easeOut"] }}
          onAnimationComplete={() => setCurtainDone(true)}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.05, delay: 0.2 }}
      >
        <ScrollFx />
        {children}
      </motion.div>
    </>
  );
}
