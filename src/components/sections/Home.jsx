// src/components/sections/Home.jsx
import { useParallax } from "../../hooks";
import { Reveal, GlitchText } from "../ui";

export default function Home({ data }) {
  const [parallaxRef, parallaxY] = useParallax(0.18);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      ref={parallaxRef}
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto"
    >
      {/* Floating orb — desktop */}
      <div className="absolute right-0 xl:right-16 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
        <div
          className="absolute rounded-full animate-pulse-ring"
          style={{ width:340, height:340, border:"1px solid var(--theme-bgglow)", top:0, left:0 }}
        />
          <div
            className="animate-hero-float flex items-center justify-center rounded-full overflow-hidden"
            style={{
              width:300, height:300,
              background:"radial-gradient(circle at 40% 40%, var(--theme-bgglow) 0%, rgba(255,255,255,0.02) 50%, transparent 70%)",
              border:"1px solid var(--theme-bgglow)",
              boxShadow:"0 0 80px var(--theme-bgglow), inset 0 0 60px rgba(255,255,255,0.02)",
            }}
          >
            {data.heroImg ? (
              <img src={data.heroImg} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontSize:"5rem" }}>{data.heroEmoji || "👨‍💻"}</span>
            )}
          </div>
      </div>

      {/* Content */}
      <div style={{ transform:`translateY(${parallaxY * -0.3}px)` }}>
        <Reveal delay={80}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-7 bg-white/5 border border-white/10" style={{ color: 'var(--theme-primary)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--theme-primary)', boxShadow: '0 0 10px var(--theme-primary)', animation:"pulseRing 2s infinite" }} />
            {data.badge}
          </span>
        </Reveal>

        <Reveal delay={180}>
          {/* Glitch headline — moderate size, not oversized */}
          <h1
            className="font-display font-extrabold leading-tight tracking-tight mb-3"
            style={{ fontSize:"clamp(1.85rem, 4.5vw, 3rem)" }}
          >
            <GlitchText text={data.headline} />
          </h1>
          {/* Role subtitle */}
          <p className="font-display font-semibold text-lg mb-5 tracking-wide" style={{ color: 'var(--theme-primary)' }}>
            {data.role}
          </p>
        </Reveal>

        <Reveal delay={250}>
          <p className="text-slate-400 text-base max-w-xl leading-relaxed mb-9 font-body">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("projects")}
              className="btn-grad text-white font-semibold px-8 py-3 rounded-full text-sm"
            >
              {data.cta1}
            </button>
            {data.resumeUrl && (
              <a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center btn-outline-glow text-slate-300 font-semibold px-8 py-3 rounded-full text-sm transition-all border border-white/10 hover:bg-white/5 active:scale-95"
                style={{ color: 'var(--theme-primary)' }}
              >
                <i className="fa-solid fa-file-arrow-down mr-2" />
                View CV
              </a>
            )}
            <button
              onClick={() => scrollTo("contact")}
              className="btn-outline-glow text-slate-300 font-semibold px-8 py-3 rounded-full text-sm bg-transparent cursor-pointer"
            >
              {data.cta2}
            </button>
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 pointer-events-none"
        style={{ animation:"orbFloat 2.5s ease-in-out infinite alternate" }}
      >
        <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, transparent, var(--theme-primary), transparent)' }} />
      </div>
    </section>
  );
}
