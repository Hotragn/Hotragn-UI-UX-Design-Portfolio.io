"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  CornerDownLeft,
  FileText,
  Hash,
  Moon,
  Pencil,
  Play,
  Search,
  Sun,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motionOff } from "@/lib/motion";
import { isCalm, setCalm, useCalmVersion } from "@/lib/calm";
import { isDarkTheme, toggleTheme } from "@/lib/theme";
import { useDesignNotes } from "@/components/providers";

/**
 * Command palette (Cmd/Ctrl+K)
 * ============================
 * One keyboard-first way into everything the site can do: jump to any
 * band of the homepage, open any case study, flip the theme, turn design
 * notes on, turn calm mode on, replay the intro.
 *
 * It is a real dialog, not a decorated div. Cmd+K or Ctrl+K opens it,
 * Esc closes it, focus moves to the input on open and returns to
 * whatever had it before on close, and Tab cannot leave the panel while
 * it is open. The list follows the combobox / listbox pattern:
 * `aria-activedescendant` moves the selection with the arrow keys while
 * real focus stays in the text field, so a screen reader announces the
 * highlighted option without focus ever jumping around.
 *
 * The panel is only in the DOM while it is open, so a closed palette
 * costs one small button in the header and one keydown listener.
 */

type Item = {
  id: string;
  label: string;
  hint: string;
  group: string;
  keywords: string;
  icon: React.ReactNode;
  run: () => void;
  /** Recomputed each time the palette opens, for the toggles. */
  state?: () => string;
};

const ICON = { size: 15, strokeWidth: 1.7, "aria-hidden": true } as const;

const SECTIONS: { id: string; label: string; keywords: string }[] = [
  { id: "work", label: "Selected work", keywords: "case studies projects portfolio" },
  { id: "experience", label: "Experience", keywords: "roles timeline jobs history resume" },
  { id: "process", label: "How I work", keywords: "process method evidence research loop" },
  { id: "onboarding", label: "Interaction design", keywords: "onboarding demo device prototype" },
  { id: "writing", label: "Research and writing", keywords: "articles medium teardown evaluation" },
  { id: "systems", label: "Research frameworks", keywords: "methodology measurement systems" },
  { id: "about", label: "About", keywords: "bio skills who background" },
  { id: "contact", label: "Contact", keywords: "email hire get in touch reach" },
];

const CASES: { href: string; label: string; keywords: string }[] = [
  { href: "/work/paypal", label: "PayPal Wallet", keywords: "fintech money flows error recovery wireframes" },
  { href: "/work/rare-rabbit", label: "Rare Rabbit", keywords: "ecommerce cart abandonment mobile fitts" },
  { href: "/work/notion", label: "Notion", keywords: "information architecture moscow prototype" },
  { href: "/work/family-foundations", label: "Family Foundations", keywords: "adoption usability testing ai" },
];

export function CommandPalette() {
  const router = useRouter();
  const { notesOn, toggleNotes } = useDesignNotes();
  const calmVersion = useCalmVersion();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const goSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: motionOff() ? "auto" : "smooth", block: "start" });
        try {
          history.replaceState(null, "", `#${id}`);
        } catch {}
      } else {
        router.push(`/#${id}`);
      }
    },
    [router]
  );

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    SECTIONS.forEach((s) => {
      list.push({
        id: `go-${s.id}`,
        label: s.label,
        hint: "Jump to section",
        group: "Go to",
        keywords: s.keywords,
        icon: <Hash {...ICON} />,
        run: () => goSection(s.id),
      });
    });
    CASES.forEach((c) => {
      list.push({
        id: `case-${c.href}`,
        label: c.label,
        hint: "Open the case study",
        group: "Case studies",
        keywords: c.keywords,
        icon: <FileText {...ICON} />,
        run: () => router.push(c.href),
      });
    });
    list.push(
      {
        id: "theme",
        label: "Switch theme",
        hint: "Light and dark",
        group: "Settings",
        keywords: "dark light mode colour color night",
        icon: isDarkTheme() ? <Sun {...ICON} /> : <Moon {...ICON} />,
        run: toggleTheme,
        state: () => (isDarkTheme() ? "Dark" : "Light"),
      },
      {
        id: "calm",
        label: "Calm mode",
        hint: "Stop the motion on this site",
        group: "Settings",
        keywords: "reduce motion animation still accessibility quiet",
        icon: <Waves {...ICON} />,
        run: () => setCalm(!isCalm()),
        state: () => (isCalm() ? "On" : "Off"),
      },
      {
        id: "notes",
        label: "Design notes",
        hint: "The reasoning in the margins",
        group: "Settings",
        keywords: "annotations margin why decisions commentary",
        icon: <Pencil {...ICON} />,
        run: toggleNotes,
        state: () => (notesOn ? "On" : "Off"),
      },
      {
        id: "intro",
        label: "Replay the intro",
        hint: "The opening title sequence",
        group: "Settings",
        keywords: "animation glimpse opening titles again",
        icon: <Play {...ICON} />,
        run: () => window.dispatchEvent(new Event("intro:replay")),
      },
      {
        id: "top",
        label: "Back to the top",
        hint: "Return to the header",
        group: "Settings",
        keywords: "scroll up home start",
        icon: <ArrowUp {...ICON} />,
        run: () =>
          window.scrollTo({ top: 0, behavior: motionOff() ? "auto" : "smooth" }),
      }
    );
    return list;
    // notesOn and calmVersion only affect the "state" labels, which is
    // exactly why they belong in the dependency list.
  }, [goSection, router, toggleNotes, notesOn, calmVersion]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${item.label} ${item.group} ${item.hint} ${item.keywords}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  // ---- Open and close ------------------------------------------------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((was) => !was);
      }
    };
    const onRequest = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("cmdk:open", onRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("cmdk:open", onRequest);
    };
  }, []);

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      // Synchronously, not on the next animation frame: this effect runs
      // after React has already put the input in the DOM, and a throttled
      // or starved rAF must never be able to strand a keyboard user
      // outside the dialog they just opened.
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    const previous = restoreRef.current;
    restoreRef.current = null;
    if (previous && document.contains(previous)) {
      previous.focus({ preventScroll: true });
    }
  }, [open]);

  // Keep the highlighted option in view inside the scrolling list.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const node = list?.children[active] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open, results.length]);

  const runItem = (item: Item) => {
    close();
    item.run();
  };

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    // Focus trap: the input and the close button are the only focusable
    // things in here, and the list is driven by aria-activedescendant, so
    // holding Tab simply keeps you on the field. Esc is always the exit.
    if (e.key === "Tab") {
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(results.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) runItem(item);
    }
  };

  if (!open) return null;

  const activeItem = results[active];

  return (
    <div
      className="cmdk-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmdk-title"
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
      >
        <h2 id="cmdk-title" className="sr-only">
          Command palette
        </h2>

        <div className="cmdk-field">
          <Search size={17} strokeWidth={1.7} aria-hidden="true" className="cmdk-field-icon" />
          <input
            ref={inputRef}
            id="cmdk-input"
            className="cmdk-input"
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-autocomplete="list"
            aria-label="Search sections, case studies and settings"
            aria-activedescendant={activeItem ? `cmdk-opt-${activeItem.id}` : undefined}
            placeholder="Jump to a section, open a case, change a setting"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
          />
          <button type="button" className="cmdk-close" onClick={close}>
            Esc
          </button>
        </div>

        <ul className="cmdk-list" id="cmdk-list" role="listbox" aria-label="Commands" ref={listRef}>
          {results.map((item, i) => (
            <li
              key={item.id}
              id={`cmdk-opt-${item.id}`}
              role="option"
              aria-selected={i === active}
              className={cn("cmdk-item", i === active && "is-active")}
              onMouseMove={() => setActive(i)}
              onClick={() => runItem(item)}
            >
              <span className="cmdk-item-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="cmdk-item-text">
                <span className="cmdk-item-label">{item.label}</span>
                <span className="cmdk-item-hint">{item.hint}</span>
              </span>
              {item.state && <span className="cmdk-item-state">{item.state()}</span>}
              <span className="cmdk-item-group">{item.group}</span>
            </li>
          ))}
        </ul>

        {!results.length && (
          <p className="cmdk-empty">Nothing here matches that. Try &quot;work&quot; or &quot;calm&quot;.</p>
        )}

        <p className="cmdk-foot">
          <span>
            <CornerDownLeft size={13} strokeWidth={1.8} aria-hidden="true" /> to run
          </span>
          <span>Arrow keys to move</span>
          <span>Esc to close</span>
        </p>
      </div>
    </div>
  );
}

/**
 * The unobtrusive hint that the shortcut exists, sitting in the header
 * utility cluster. It is a real button, so the palette is reachable by
 * pointer and by keyboard even for someone who never learns the chord.
 */
export function CommandPaletteHint() {
  const [mac, setMac] = useState(false);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  return (
    <button
      type="button"
      className="cmdk-hint"
      onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
      aria-label={`Open the command palette. Keyboard shortcut ${mac ? "Command" : "Control"} K`}
      title="Command palette"
    >
      <span aria-hidden="true">{mac ? "⌘" : "Ctrl"}</span>
      <span aria-hidden="true">K</span>
    </button>
  );
}
