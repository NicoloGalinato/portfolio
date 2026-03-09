// src/components/ui/Background.jsx
// ─────────────────────────────────────────────────────────────
// All ambient background visual effects:
//   GalaxyBg       — deep-space gradient + star field
//   FloatingOrbs   — slow-drifting radial blobs
//   ShootingStars  — streaking star animations
//   CursorGlow     — mouse-following violet glow
//   ScrollProgress — top progress bar
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useScrollProgress } from "../../hooks";

// ── GalaxyBg ──────────────────────────────────────────────────
export function GalaxyBg() {
  return (
    <>
      {/* Deep space nebula */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 15% 25%, var(--bg-nebula-1, rgba(88,28,135,0.5)) 0%, transparent 60%)," +
            "radial-gradient(ellipse 70% 60% at 85% 65%, var(--bg-nebula-2, rgba(30,58,138,0.4)) 0%, transparent 60%)," +
            "radial-gradient(ellipse 55% 45% at 50% 95%, var(--bg-nebula-3, rgba(157,23,77,0.2)) 0%, transparent 55%)," +
            "#020008",
          animation: "galaxyShift 24s ease-in-out infinite alternate",
        }}
      />

      {/* Star field */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 8% 12%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 22% 38%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1.5px 1.5px at 38% 6%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 55% 68%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 71% 22%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 88% 52%, rgba(255,255,255,0.5), transparent),
            radial-gradient(2px 2px at 12% 78%, rgba(167,139,250,0.9), transparent),
            radial-gradient(2px 2px at 50% 44%, rgba(96,165,250,0.8), transparent),
            radial-gradient(1.5px 1.5px at 82% 8%, rgba(244,114,182,0.7), transparent),
            radial-gradient(1px 1px at 30% 58%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 65% 32%, rgba(255,255,255,0.7), transparent),
            radial-gradient(2px 2px at 42% 88%, rgba(167,139,250,0.6), transparent),
            radial-gradient(1px 1px at 94% 78%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1.5px 1.5px at 77% 90%, rgba(96,165,250,0.5), transparent)
          `,
          animation: "twinkle 10s ease-in-out infinite alternate",
        }}
      />
    </>
  );
}

// ── FloatingOrbs ──────────────────────────────────────────────
export function FloatingOrbs() {
  const orbs = [
    { size: 420, x: "8%",  y: "15%", color: "rgba(88,28,135,0.18)",   dur: 18 },
    { size: 320, x: "75%", y: "55%", color: "rgba(30,58,138,0.15)",   dur: 22 },
    { size: 280, x: "45%", y: "75%", color: "rgba(157,23,77,0.12)",   dur: 15 },
    { size: 200, x: "88%", y: "10%", color: "rgba(167,139,250,0.08)", dur: 28 },
  ];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  orb.size,
            height: orb.size,
            left:   orb.x,
            top:    orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `orbFloat ${orb.dur}s ease-in-out infinite alternate`,
            animationDelay: `${i * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── ShootingStars ─────────────────────────────────────────────
export function ShootingStars() {
  const stars = Array.from({ length: 6 }, (_, i) => ({
    id:       i,
    delay:    i * 3.5,
    top:      `${10 + i * 12}%`,
    duration: 2.5 + (i % 3) * 0.8,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            top:       s.top,
            left:      "-10%",
            animation: `shootingStar ${s.duration}s linear ${s.delay}s infinite`,
          }}
        >
          <div
            style={{
              width:      "120px",
              height:     "1.5px",
              background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.9), transparent)",
              borderRadius: "2px",
              filter:     "blur(0.5px)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── CursorGlow ────────────────────────────────────────────────
export function CursorGlow() {
  const [pos,    setPos]    = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMove  = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onDown  = () => setActive(true);
    const onUp    = () => setActive(false);

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[300] rounded-full transition-all duration-150"
      style={{
        left:      pos.x,
        top:       pos.y,
        width:     active ? 48 : 24,
        height:    active ? 48 : 24,
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)",
        filter:    "blur(4px)",
      }}
    />
  );
}

// ── ScrollProgress ────────────────────────────────────────────
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px]">
      <div
        className="h-full transition-all duration-75"
        style={{
          width:      `${progress}%`,
          background: "linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)",
          boxShadow:  "0 0 8px rgba(167,139,250,0.8)",
        }}
      />
    </div>
  );
}
