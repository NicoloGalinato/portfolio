// src/hooks/index.js
import { useState, useEffect, useRef } from "react";
import { DEFAULT_DATA } from "../data/defaultData";

// ── useCMS ────────────────────────────────────────────────────
export function useCMS() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio_cms_v3");
      return saved ? JSON.parse(saved) : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  // Sync with server on mount
  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(json => {
        if (json && !json.error) {
          setData(json);
          localStorage.setItem("portfolio_cms_v3", JSON.stringify(json));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "portfolio_cms_v3") {
        try {
          setData(e.newValue ? JSON.parse(e.newValue) : DEFAULT_DATA);
        } catch {
          setData(DEFAULT_DATA);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const save = async (newData) => {
    setData(newData);
    localStorage.setItem("portfolio_cms_v3", JSON.stringify(newData));
    
    // Persist to local disk via server API
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      });
    } catch (e) {
      console.error("Failed to persist to disk:", e);
    }
  };

  const update = (section, patch) =>
    save({ ...data, [section]: { ...data[section], ...patch } });

  const reset = () => save(DEFAULT_DATA);

  return { data, update, reset };
}

// ── useInView ─────────────────────────────────────────────────
// Bidirectional: animates IN when entering viewport and OUT when leaving.
// Elements fade/slide back to their initial state when scrolled away.
export function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disconnect any previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Update every intersection change — true when visible, false when hidden
        setInView(entry.isIntersecting);
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  // Re-run if threshold changes; ref.current changes don't trigger re-run so we
  // also schedule a retry after the first paint to handle deferred mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  // Retry once after mount in case the element wasn't in the DOM yet
  useEffect(() => {
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el || observerRef.current) return;
      observerRef.current = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold, rootMargin: "0px 0px -40px 0px" }
      );
      observerRef.current.observe(el);
    }, 120);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

// ── useParallax ───────────────────────────────────────────────
export function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * speed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // fire once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return [ref, offset];
}

// ── useScrollProgress ─────────────────────────────────────────
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

// ── useActiveSection ──────────────────────────────────────────
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(
    sectionIds[0].charAt(0).toUpperCase() + sectionIds[0].slice(1)
  );

  useEffect(() => {
    // Use scroll position for reliable active detection
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActive(
            sectionIds[i].charAt(0).toUpperCase() + sectionIds[i].slice(1)
          );
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return active;
}

// ── useLockBodyScroll ─────────────────────────────────────────
export function useLockBodyScroll(locked) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [locked]);
}
