"use client";

import { AnimatePresence, motion } from "framer-motion";
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
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M11.5 1.5 14.5 4.5 5.5 13.5 2 14 2.5 10.5 11.5 1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      Design notes
    </button>
  );
}
