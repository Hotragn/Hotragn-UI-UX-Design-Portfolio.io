const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// ---------- Header shadow on scroll ----------
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile menu ----------
const toggle = document.querySelector(".menu-toggle");
const links = document.getElementById("nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ---------- Scroll reveal ----------
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// ---------- Reading progress (case pages) ----------
const progress = document.querySelector(".progress");
if (progress) {
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

// ---------- Footer year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Hero word-by-word reveal ----------
const headline = document.getElementById("hero-headline");
if (headline && !prefersReduced) {
  const wrapWords = (node, state) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((piece) => {
          if (/^\s+$/.test(piece) || piece === "") {
            frag.appendChild(document.createTextNode(piece));
          } else {
            const w = document.createElement("span");
            w.className = "word";
            const inner = document.createElement("span");
            inner.textContent = piece;
            inner.style.setProperty("--d", `${state.i * 0.07}s`);
            state.i += 1;
            w.appendChild(inner);
            frag.appendChild(w);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child, state);
      }
    });
  };
  wrapWords(headline, { i: 0 });
}

// ---------- Custom cursor ----------
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
if (dot && ring && finePointer && !prefersReduced) {
  document.body.classList.add("has-cursor");
  let mx = -100, my = -100, rx = -100, ry = -100, raf = null;
  const loop = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    if (Math.abs(mx - rx) > 0.15 || Math.abs(my - ry) > 0.15) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
    }
  };
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener("mouseover", (e) => {
    ring.classList.toggle("is-hover", Boolean(e.target.closest("a, button")));
  });
}

// ---------- 3D tilt with glare ----------
if (finePointer && !prefersReduced) {
  document.querySelectorAll(".tilt").forEach((card) => {
    const glare = card.querySelector(".tilt-glare");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 7;
      const rotX = (0.5 - py) * 6;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      if (glare) {
        card.style.setProperty("--gx", `${px * 100}%`);
        card.style.setProperty("--gy", `${py * 100}%`);
      }
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

// ---------- Magnetic buttons ----------
if (finePointer && !prefersReduced) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

// ---------- Hero artifact parallax ----------
const stage = document.getElementById("artifact-stage");
if (stage && finePointer && !prefersReduced) {
  const cards = stage.querySelectorAll(".float-card");
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
  const render = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    cards.forEach((c) => {
      const depth = Number(c.dataset.depth || 20);
      c.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
    });
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      raf = requestAnimationFrame(render);
    } else {
      raf = null;
    }
  };
  window.addEventListener("mousemove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 1.6;
    ty = (e.clientY / window.innerHeight - 0.5) * 1.2;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });
  // gentle idle drift, but only while the stage is on screen
  let t = 0, driftRaf = null;
  const drift = () => {
    if (raf === null) {
      t += 0.008;
      cards.forEach((c, i) => {
        const depth = Number(c.dataset.depth || 20);
        const y = Math.sin(t + i * 1.7) * depth * 0.12;
        c.style.transform = `translate3d(${cx * depth}px, ${cy * depth + y}px, 0)`;
      });
    }
    driftRaf = requestAnimationFrame(drift);
  };
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !driftRaf) {
        driftRaf = requestAnimationFrame(drift);
      } else if (!entry.isIntersecting && driftRaf) {
        cancelAnimationFrame(driftRaf);
        driftRaf = null;
      }
    });
  }).observe(stage);
}

// ---------- Design notes mode ----------
const notesToggle = document.getElementById("notes-toggle");
if (notesToggle) {
  const stored = sessionStorage.getItem("design-notes") === "on";
  if (stored) {
    document.body.classList.add("show-notes");
    notesToggle.setAttribute("aria-pressed", "true");
  }
  notesToggle.addEventListener("click", () => {
    const on = document.body.classList.toggle("show-notes");
    notesToggle.setAttribute("aria-pressed", String(on));
    sessionStorage.setItem("design-notes", on ? "on" : "off");
  });
}
