"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { useDesignNotes } from "@/components/providers";

/**
 * A margin annotation revealed by the "Design notes" nav toggle.
 * State lives in context and persists per session.
 */
export function DesignNote({ children }: { children: React.ReactNode }) {
  const { notesOn } = useDesignNotes();
  return (
    <AnimatePresence initial={false}>
      {notesOn && (
        <motion.div
          className="design-note"
          initial={{ opacity: 0, y: 8, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -0.4 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NotesToggle() {
  const { notesOn, toggleNotes } = useDesignNotes();
  return (
    <button
      type="button"
      className="notes-toggle"
      aria-pressed={notesOn}
      title="Reveal the design decisions behind this site"
      onClick={toggleNotes}
    >
      <Pencil size={14} strokeWidth={1.6} aria-hidden="true" />
      Design notes
    </button>
  );
}
