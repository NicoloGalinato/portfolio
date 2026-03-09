// src/components/sections/About.jsx
// ─────────────────────────────────────────────────────────────
// About section with:
//   - Avatar card with scan-line effect + corner accents
//   - Staggered left / right Reveal animations
//   - Animated stat counters (4+, 30+, 12+)
//   - Floating avatar emoji
// ─────────────────────────────────────────────────────────────

import { Reveal, SectionHeader, AnimatedCounter } from "../ui";

export default function About({ data }) {
  return (
    <section
      id="about"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-28 max-w-7xl mx-auto"
    >
      <SectionHeader label="// about me" title={data.title} />

      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-24 items-center">

        {/* Avatar card */}
        <Reveal direction="left" delay={100}>
          <div className="glass glass-hover rounded-3xl aspect-[4/5] flex items-center justify-center relative overflow-hidden cursor-default">

            {/* Scan-line sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              <div
                className="w-full h-px"
                style={{ background: "linear-gradient(to right, transparent, var(--theme-primary), transparent)", animation: "scanLine 4s linear infinite" }}
              />
            </div>

            {/* Ambient inner glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, var(--theme-bgglow), transparent 60%)," +
                  "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.02), transparent 60%)",
              }}
            />

            {/* Emoji or Image */}
            {data.avatarImg ? (
              <img src={data.avatarImg} alt="Avatar" className="w-80 h-88 object-cover rounded-[.5rem] shadow-2xl relative z-10 animate-hero-float" />
            ) : (
              <span className="text-8xl animate-hero-float relative z-10">{data.avatarEmoji}</span>
            )}

            {/* Corner bracket accents */}
            {[
              ["top-3 left-3",    "border-l border-t"],
              ["top-3 right-3",   "border-r border-t"],
              ["bottom-3 left-3", "border-l border-b"],
              ["bottom-3 right-3","border-r border-b"],
            ].map(([pos, bdr], i) => (
              <div key={i} className={`absolute ${pos} w-4 h-4 ${bdr}`} style={{ borderColor: 'var(--theme-bgglow)' }} />
            ))}
          </div>
        </Reveal>

        {/* Text + stats */}
        <div>
          <Reveal direction="right" delay={150}>
            <p className="text-slate-400 leading-relaxed mb-4">{data.bio1}</p>
          </Reveal>

          <Reveal direction="right" delay={250}>
            <p className="text-slate-400 leading-relaxed mb-8">{data.bio2}</p>
          </Reveal>

          {/* Animated stat counters */}
          <div className="flex gap-10">
            {data.stats.map((stat, i) => (
              <Reveal key={i} direction="up" delay={300 + i * 100}>
                <div className="text-center">
                  <AnimatedCounter target={stat.num} />
                  <div className="text-slate-500 text-xs mt-1 font-body">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
