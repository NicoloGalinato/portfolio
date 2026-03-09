// src/components/sections/Projects.jsx
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Reveal, SectionHeader } from "../ui";
import { useLockBodyScroll } from "../../hooks";

// ── Project Case Study Modal ──────────────────────────────────
function CaseStudyModal({ proj, onClose }) {
  useLockBodyScroll(true);
  const [scrolled, setScrolled] = useState(false);
  const cs = proj.caseStudy;

  // Drag-to-scroll state
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setStartScrollTop(scrollRef.current.scrollTop);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5; // Custom scroll speed multiplier
    scrollRef.current.scrollTop = startScrollTop - walk;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div
        ref={scrollRef}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900/40 backdrop-blur-3xl rounded-[20px] animate-modal-in hide-scrollbar"
        onScroll={(e) => setScrolled(e.target.scrollTop > 10)}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ 
          border: "1px solid var(--theme-bgglow)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px var(--theme-bgglow)",
          cursor: isDragging ? "grabbing" : "grab"
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b rounded-t-[20px] transition-all duration-300"
          style={{ 
            background: scrolled ? "rgba(15, 10, 35, 0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            borderColor: scrolled ? "rgba(255,255,255,0.1)" : "transparent"
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-100 uppercase tracking-tight">{proj.title}</h2>
              <div className="flex gap-3 text-xs text-slate-500 mt-1">
                {cs.year && <span>📅 {cs.year}</span>}
                {cs.duration && <span>⏱ {cs.duration}</span>}
                {cs.role && <span>👤 {cs.role}</span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10"
          >✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-7">

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {proj.tags.map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full border bg-white/5 text-slate-300" style={{ borderColor: 'var(--theme-primary, rgba(255,255,255,0.1))' }}>{t}</span>
            ))}
          </div>

          {/* Hero Image / Emoji */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/40 min-h-[220px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(to bottom right, var(--theme-primary), var(--theme-secondary))' }} />
            {proj.img ? (
              <img 
                src={proj.img} 
                alt={proj.title} 
                className="relative z-10 max-h-[280px] w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                style={{ filter: 'drop-shadow(0 0 20px var(--theme-bgglow))' }}
              />
            ) : (
              <span className="relative z-10 text-9xl animate-hero-float">{proj.emoji}</span>
            )}
          </div>

          {/* Overview */}
          <Block icon="🌐" title="Overview" text={cs.overview} />

          {/* Problem / Solution side by side on lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Block icon="🔍" title="The Problem" text={cs.problem} accent="red" />
            <Block icon="💡" title="The Solution" text={cs.solution} accent="green" />
          </div>

          {/* Tech Stack */}
          {cs.techStack && cs.techStack.length > 0 && (
            <div>
              <SectionLabel icon="🛠" title="Tech Stack" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {cs.techStack.map((row, i) => (
                  <div key={i} className="glass rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="text-xs font-bold w-20 flex-shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }}>{row.label}</span>
                    <span className="text-sm text-slate-300">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          <Block icon="⚡" title="Challenges & Solutions" text={cs.challenges} accent="yellow" />

          {/* Project Links Section */}
          <div className="glass rounded-2xl p-6 border-l-1" style={{ borderColor: 'var(--theme-primary)' }}>
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--theme-primary)' }}>
              <i className="fa-solid fa-link"/>
              Project Access
            </h3>
            <div className="flex flex-wrap gap-4">
              {proj.demo && proj.demo !== "#" && (
                <a href={proj.demo} target="_blank" rel="noreferrer"
                  className="btn-grad text-white text-sm font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  View Live Demo
                </a>
              )}
              {proj.github && proj.github !== "#" && (
                <a href={proj.github} target="_blank" rel="noreferrer"
                  className="btn-outline-glow text-slate-100 text-sm font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 bg-white/5">
                  <i className="fa-brands fa-github" />
                  Source Code
                </a>
              )}
              {(!proj.demo || proj.demo === "#") && (!proj.github || proj.github === "#") && (
                <p className="text-slate-500 text-sm italic">Links are currently private or unavailable.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function SectionLabel({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span>{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>{title}</span>
    </div>
  );
}

function Block({ icon, title, text, accent }) {
  const borderColors = { red:"border-red-400/20", green:"border-emerald-400/20", yellow:"border-yellow-400/20", default:"border-white/8" };
  const border = borderColors[accent] || borderColors.default;
  return (
    <div className={`glass rounded-2xl p-4 border-l-2 ${border}`}>
      <SectionLabel icon={icon} title={title} />
      <p className="text-slate-400 text-sm leading-relaxed mt-2">{text}</p>
    </div>
  );
}

// ── Projects Section ──────────────────────────────────────────
export default function Projects({ data }) {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section id="projects" className="relative z-10 px-6 py-28 max-w-7xl mx-auto">
      <SectionHeader label="// projects" title={data.title} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.items.map((proj, i) => (
          <Reveal key={proj.id} direction={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
            <div className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col">

              {/* Thumbnail */}
              <div
                className="h-56 flex items-center justify-center text-6xl relative overflow-hidden"
                style={{ background:"linear-gradient(135deg, var(--bg-nebula-1, rgba(88,28,135,0.45)), var(--bg-nebula-2, rgba(30,58,138,0.45)))" }}
              >
                <div className="absolute inset-0" style={{ background:"radial-gradient(circle at 50% 50%, var(--theme-bgglow), transparent 70%)" }} />
                {proj.img ? (
                  <img src={proj.img} alt={proj.title} className="w-40 h-40 object-contain shadow-2xl transition-transform duration-300 hover:scale-110" style={{ animation:`heroFloat ${5+i}s ease-in-out infinite`, filter: 'drop-shadow(0 0 20px var(--theme-bgglow))' }} />
                ) : (
                  <span style={{ animation:`heroFloat ${5+i}s ease-in-out infinite` }}>{proj.emoji}</span>
                )}
                {/* Year badge */}
                {proj.caseStudy?.year && (
                  <span className="absolute top-3 right-3 text-xs font-bold bg-black/40 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-full text-slate-400">
                    {proj.caseStudy.year}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {proj.tags.map((t) => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border" style={{ borderColor: 'var(--theme-bgglow)', color: 'var(--theme-primary)' }}>{t}</span>
                  ))}
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{proj.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{proj.description}</p>

                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-white/5 flex-wrap">
                  {/* View Project — opens case study */}
                  <button
                    onClick={() => setActiveModal(proj)}
                    className="btn-grad text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1"
                  >
                    📖 View Project
                  </button>
                  {proj.demo && proj.demo !== "#" && (
                    <a href={proj.demo} target="_blank" rel="noreferrer"
                      className="text-xs font-bold transition-colors flex items-center gap-1 hover:brightness-125" style={{ color: 'var(--theme-primary)' }}>
                      Live Demo ↗
                    </a>
                  )}
                  {proj.github && proj.github !== "#" && (
                    <a href={proj.github} target="_blank" rel="noreferrer"
                      className="text-xs font-bold transition-colors flex items-center gap-1 hover:brightness-125" style={{ color: 'var(--theme-primary)' }}>
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Case Study Modal */}
      {activeModal && (
        <CaseStudyModal proj={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </section>
  );
}
