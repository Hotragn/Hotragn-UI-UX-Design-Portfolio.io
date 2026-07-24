"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

type DesignNotesContextValue = {
  notesOn: boolean;
  toggleNotes: () => void;
};

const DesignNotesContext = createContext<DesignNotesContextValue>({
  notesOn: false,
  toggleNotes: () => {},
});

export function useDesignNotes() {
  return useContext(DesignNotesContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [notesOn, setNotesOn] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("design-notes") === "on") setNotesOn(true);
    } catch {}
  }, []);

  const toggleNotes = useCallback(() => {
    setNotesOn((on) => {
      const next = !on;
      try {
        sessionStorage.setItem("design-notes", next ? "on" : "off");
        // Recognition for the first-visit hint: once someone has used the
        // toggle, the coach-mark never needs to introduce it.
        localStorage.setItem("notes-used", "1");
      } catch {}
      return next;
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <DesignNotesContext.Provider value={{ notesOn, toggleNotes }}>
        {children}
      </DesignNotesContext.Provider>
    </MotionConfig>
  );
}
