// src/components/ui/index.jsx
import { useState, useEffect } from "react";
import { useInView } from "../../hooks";

// ── Reveal ────────────────────────────────────────────────────
export function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView(0.08);

  const transforms = {
    up:    "translateY(40px)",
    down:  "translateY(-40px)",
    left:  "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.9)",
    none:  "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────
export function SectionHeader({ label, title }) {
  return (
    <Reveal delay={0}>
      <p className="text-violet-400 text-xs font-bold tracking-widest uppercase mb-2">{label}</p>
      <h2 className="font-display font-extrabold text-4xl mb-3">{title}</h2>
      <div className="section-line" />
    </Reveal>
  );
}

// ── AnimatedCounter ───────────────────────────────────────────
export function AnimatedCounter({ target }) {
  const [ref, inView] = useInView(0.3);
  const [count, setCount] = useState(0);
  const num    = parseInt(target.replace(/\D/g, "")) || 0;
  const suffix = target.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step  = Math.ceil(num / 30);
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(current);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, num]);

  return (
    <span ref={ref} className="font-display font-extrabold text-3xl grad-text-2">
      {count}{suffix}
    </span>
  );
}

// ── GlitchText ────────────────────────────────────────────────
// Renders a heading with a CSS glitch / chromatic-aberration effect.
export function GlitchText({ text, className = "" }) {
  return (
    <span className={`glitch-wrap ${className}`} data-text={text}>
      <span className="glitch-main">{text}</span>
      <span className="glitch-layer glitch-r" aria-hidden="true">{text}</span>
      <span className="glitch-layer glitch-b" aria-hidden="true">{text}</span>
    </span>
  );
}
