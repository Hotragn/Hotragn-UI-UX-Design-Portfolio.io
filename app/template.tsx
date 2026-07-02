"use client";

import { motion } from "framer-motion";
import { ScrollFx } from "@/components/fx/scroll-fx";

export default function Template({ children }: { children: React.ReactNode }) {
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
