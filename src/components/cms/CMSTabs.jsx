// src/components/cms/CMSTabs.jsx
// ─────────────────────────────────────────────────────────────
// Premium CMS tab panels — one per portfolio section.
// ─────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import {
  Field, Select, AddButton, RemoveButton, SectionDivider,
  FieldCard, EmptyState, ImageOrEmoji,
  StyledSelect, FileUpload,
} from "./CMSFields";

// ── Inline dark input (used for small inline edits in tabs) ───
const INPUT = {
  background:   "rgba(15, 10, 35, 0.85)",
  border:       "1px solid rgba(255,255,255,0.1)",
  color:        "#e2e8f0",
  borderRadius: "12px",
  outline:      "none",
  fontSize:     "0.875rem",
  fontFamily:   "inherit",
  padding:      "0.5rem 0.75rem",
  width:        "100%",
  transition:   "border-color 0.2s",
};

function DIn({ value, onChange, placeholder, style = {}, className = "" }) {
  const [f, setF] = useState(false);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      style={{
        ...INPUT,
        ...(f ? { borderColor: "rgba(167,139,250,0.6)", boxShadow: "0 0 0 3px rgba(167,139,250,0.08)" } : {}),
        ...style,
      }}
      onFocus={() => setF(true)}
      onBlur={()  => setF(false)}
    />
  );
}

function DTa({ value, onChange, placeholder, style = {}, minHeight = 72 }) {
  const [f, setF] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        ...INPUT,
        minHeight,
        lineHeight: 1.6,
        resize:     "none",
        ...(f ? { borderColor: "rgba(167,139,250,0.6)", boxShadow: "0 0 0 3px rgba(167,139,250,0.08)" } : {}),
        ...style,
      }}
      onFocus={() => setF(true)}
      onBlur={()  => setF(false)}
    />
  );
}

const labelCls = "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

// ── Shared: Tab Intro Header ──────────────────────────────────
function TabHeader({ icon, title, desc, iconColor = "#a78bfa", iconBg = "rgba(124,58,237,0.25)" }) {
  return (
    <div className="flex items-start gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${iconBg}, rgba(37,99,235,0.15))`, border: "1px solid rgba(167,139,250,0.2)" }}
      >
        <i className={`fa-solid ${icon}`} style={{ color: iconColor, fontSize: "16px" }} />
      </div>
      <div>
        <h3 className="font-display font-bold text-base text-slate-200 mb-0.5">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

// ── NavTab ────────────────────────────────────────────────────
export function NavTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("nav", patch);

  return (
    <div>
      <TabHeader icon="fa-compass" title="Navigation" desc="Control the navbar logo, links, and CTA button." />

      <Field label="Logo Text" icon="fa-signature" value={data.logo} onChange={(v) => u({ logo: v })} placeholder="Your Name" helper="Displayed in the top-left of the navbar." />
      <Field label="CTA Button Label" icon="fa-bullseye" value={data.ctaLabel} onChange={(v) => u({ ctaLabel: v })} placeholder="Hire Me" helper="The primary action button in the navbar." />
      <Select label="Navbar Style" icon="fa-palette" value={data.style} options={["glass", "solid", "minimal"]} onChange={(v) => u({ style: v })} helper="Visual style of the navigation bar." />

      <SectionDivider title="Navigation Links" icon="fa-link" />

      {data.links.length === 0 && <EmptyState icon="fa-link-slash" message="No nav links yet." />}

      <div className="space-y-2 mb-2">
        {data.links.map((link, i) => (
          <FieldCard key={i}>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                {i + 1}
              </span>
              <DIn value={link} onChange={(v) => { const links = [...data.links]; links[i] = v; u({ links }); }} placeholder="Link label" />
              <RemoveButton onClick={() => u({ links: data.links.filter((_, j) => j !== i) })} />
            </div>
          </FieldCard>
        ))}
      </div>

      <AddButton label="Add Navigation Link" onClick={() => u({ links: [...data.links, "New Link"] })} />
    </div>
  );
}

// ── HomeTab ───────────────────────────────────────────────────
export function HomeTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("home", patch);

  return (
    <div>
      <TabHeader icon="fa-house" title="Hero Section" desc="Customize the main landing section of your portfolio." iconColor="#a78bfa" />

      <Field label="Status Badge"         icon="fa-circle-dot"  value={data.badge}       onChange={(v) => u({ badge: v })}       placeholder="✦ Available for work"     maxLength={50}  helper='Small badge above the headline. Supports emoji.' />
      <Field label="Headline"             icon="fa-heading"     value={data.headline}    onChange={(v) => u({ headline: v })}    placeholder="Hi! I'm Your Name"        maxLength={60}  helper="The main H1 heading. Keep it punchy." />
      <Field label="Role / Title"         icon="fa-id-badge"    value={data.role}        onChange={(v) => u({ role: v })}        placeholder="Full-Stack Developer"                     helper="Shown below the headline." />
      <Field label="Tagline / Description" icon="fa-align-left" value={data.description} onChange={(v) => u({ description: v })} multiline placeholder="I craft immersive..." maxLength={200} helper="1–2 sentence description." />

      <SectionDivider title="Hero Graphic" icon="fa-wand-magic-sparkles" />
      <ImageOrEmoji
        label="Main Graphic"
        emojiValue={data.heroEmoji || "👨‍💻"}
        imgValue={data.heroImg || ""}
        onEmojiChange={(v) => u({ heroEmoji: v })}
        onImgChange={(v) => u({ heroImg: v })}
        helper="Shown inside the floating orb on the right. Works best with square images."
      />

      <SectionDivider title="Resume / CV" icon="fa-file-pdf" />
      <FileUpload
        label="Downloadable Document"
        value={data.resumeUrl || ""}
        onChange={(v) => u({ resumeUrl: v })}
        helper="Upload your latest CV or Portfolio PDF. A download button will appear in the Hero section."
      />

      <SectionDivider title="Call-to-Action Buttons" icon="fa-hand-pointer" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary CTA"   icon="fa-bolt"     value={data.cta1} onChange={(v) => u({ cta1: v })} placeholder="View Projects" />
        <Field label="Secondary CTA" icon="fa-envelope" value={data.cta2} onChange={(v) => u({ cta2: v })} placeholder="Let's Talk" />
      </div>

      <div className="mt-2 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-500" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
        <i className="fa-solid fa-lightbulb mt-0.5" style={{ color: "#a78bfa", fontSize: "11px" }} />
        <span>Primary CTA scrolls to <strong className="text-slate-400">Projects</strong>, secondary to <strong className="text-slate-400">Contact</strong>.</span>
      </div>
    </div>
  );
}

// ── AboutTab ──────────────────────────────────────────────────
export function AboutTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("about", patch);

  return (
    <div>
      <TabHeader icon="fa-user" title="About Me" desc="Your bio, avatar and key stats." iconColor="#34d399" iconBg="rgba(52,211,153,0.2)" />

      <Field label="Section Title" icon="fa-heading" value={data.title} onChange={(v) => u({ title: v })} placeholder="A bit about myself" />

      {/* Avatar image or emoji */}
      <ImageOrEmoji
        label="Avatar"
        emojiValue={data.avatarEmoji}
        imgValue={data.avatarImg || ""}
        onEmojiChange={(v) => u({ avatarEmoji: v })}
        onImgChange={(v) => u({ avatarImg: v })}
        helper="Choose an emoji or upload a PNG/SVG image for your avatar."
      />

      <SectionDivider title="Biography" icon="fa-pen" />

      <Field label="Bio Paragraph 1" icon="fa-paragraph" value={data.bio1} onChange={(v) => u({ bio1: v })} multiline placeholder="I'm a passionate developer with..." helper="Your professional background." />
      <Field label="Bio Paragraph 2" icon="fa-paragraph" value={data.bio2} onChange={(v) => u({ bio2: v })} multiline placeholder="When I'm not coding..." helper="Personal touch — hobbies or interests." />

      <SectionDivider title="Stats Counter" icon="fa-chart-simple" />

      <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
        <i className="fa-solid fa-circle-info" style={{ fontSize: "10px" }} />
        Animated counters below your bio. Use suffixes like <code className="text-violet-400 bg-white/5 px-1 rounded">4+</code>.
      </p>

      <div className="space-y-2">
        {data.stats.map((s, i) => (
          <FieldCard key={i}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelCls}>Value</label>
                <DIn value={s.num} placeholder="4+" onChange={(v) => { const stats = data.stats.map((x, j) => j === i ? { ...x, num: v } : x); u({ stats }); }} />
              </div>
              <div>
                <label className={labelCls}>Label</label>
                <DIn value={s.label} placeholder="Years Exp." onChange={(v) => { const stats = data.stats.map((x, j) => j === i ? { ...x, label: v } : x); u({ stats }); }} />
              </div>
            </div>
          </FieldCard>
        ))}
      </div>
    </div>
  );
}

// ── SkillsTab ─────────────────────────────────────────────────
export function SkillsTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("skills", patch);

  const CATEGORY_COLORS = {
    Frontend:  { bg: "rgba(96,165,250,0.12)",  text: "#60a5fa", border: "rgba(96,165,250,0.2)"  },
    Backend:   { bg: "rgba(52,211,153,0.12)",  text: "#34d399", border: "rgba(52,211,153,0.2)"  },
    Language:  { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24", border: "rgba(251,191,36,0.2)"  },
    Database:  { bg: "rgba(167,139,250,0.12)", text: "#a78bfa", border: "rgba(167,139,250,0.2)" },
    DevOps:    { bg: "rgba(248,113,113,0.12)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
    Styling:   { bg: "rgba(244,114,182,0.12)", text: "#f472b6", border: "rgba(244,114,182,0.2)" },
    Cloud:     { bg: "rgba(251,146,60,0.12)",  text: "#fb923c", border: "rgba(251,146,60,0.2)"  },
    Mobile:    { bg: "rgba(45,212,191,0.12)",  text: "#2dd4bf", border: "rgba(45,212,191,0.2)"  },
    "Version Control": { bg: "rgba(148,163,184,0.12)", text: "#94a3b8", border: "rgba(148,163,184,0.2)" },
  };
  const getCS = (cat) => CATEGORY_COLORS[cat] || { bg: "rgba(167,139,250,0.08)", text: "#a78bfa", border: "rgba(167,139,250,0.2)" };

  return (
    <div>
      <TabHeader icon="fa-screwdriver-wrench" title="Skills & Tools" desc="Tech stack cards shown in your Skills section." iconColor="#fbbf24" iconBg="rgba(251,191,36,0.2)" />

      <Field label="Section Title" icon="fa-heading" value={data.title} onChange={(v) => u({ title: v })} placeholder="My Toolkit" />

      <SectionDivider title="Skill Cards" icon="fa-layer-group" />

      <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
        <i className="fa-solid fa-circle-info" style={{ fontSize: "10px" }} />
        Each card: an emoji icon OR image, a skill name, and a category badge.
      </p>

      {data.cards.length === 0 && (
        <EmptyState icon="fa-toolbox" message="No skills yet." action={<AddButton label="Add Skill" onClick={() => u({ cards: [{ icon: "⚡", img: "", name: "New Skill", category: "Frontend" }] })} />} />
      )}

      <div className="space-y-2 mb-2">
        {data.cards.map((card, i) => {
          const cs = getCS(card.category);
          return (
            <FieldCard key={i}>
              {/* Icon/image row */}
              <div className="flex items-center gap-2 mb-2">
                {/* Emoji input */}
                {!card.img ? (
                  <DIn
                    value={card.icon}
                    onChange={(v) => { const cards = data.cards.map((c, j) => j === i ? { ...c, icon: v } : c); u({ cards }); }}
                    placeholder="⚡"
                    style={{ width: 52, textAlign: "center", fontSize: "1.2rem", padding: "0.5rem" }}
                  />
                ) : (
                  <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={card.img} alt={card.name} style={{ maxHeight: 32, maxWidth: 32, objectFit: "contain" }} />
                  </div>
                )}
                {/* Image upload toggle button */}
                <button
                  onClick={() => {
                    const cards = data.cards.map((c, j) => j === i ? { ...c, img: card.img ? "" : "upload" } : c);
                    u({ cards });
                  }}
                  title={card.img ? "Remove image, use emoji" : "Upload image"}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0"
                  style={{ color: card.img ? "#f87171" : "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <i className={`fa-solid ${card.img ? "fa-rotate-left" : "fa-image"}`} style={{ fontSize: "11px" }} />
                </button>
                <DIn
                  value={card.name}
                  onChange={(v) => { const cards = data.cards.map((c, j) => j === i ? { ...c, name: v } : c); u({ cards }); }}
                  placeholder="Skill name"
                  style={{ flex: 1 }}
                />
                <RemoveButton onClick={() => u({ cards: data.cards.filter((_, j) => j !== i) })} />
              </div>

              {/* Image upload zone (only when img === "upload" or img is set) */}
              {(card.img === "upload" || (card.img && card.img !== "upload")) && (
                <SkillImageUpload
                  current={card.img === "upload" ? "" : card.img}
                  onUpload={(url) => { const cards = data.cards.map((c, j) => j === i ? { ...c, img: url } : c); u({ cards }); }}
                  onRemove={() => { const cards = data.cards.map((c, j) => j === i ? { ...c, img: "" } : c); u({ cards }); }}
                />
              )}

              {/* Category */}
              <div className="flex items-center gap-2 mt-2">
                <i className="fa-solid fa-tag text-slate-600" style={{ fontSize: "10px" }} />
                <DIn
                  value={card.category}
                  onChange={(v) => { const cards = data.cards.map((c, j) => j === i ? { ...c, category: v } : c); u({ cards }); }}
                  placeholder="Category"
                  style={{ flex: 1 }}
                />
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap" style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                  {card.category || "—"}
                </span>
              </div>
            </FieldCard>
          );
        })}
      </div>

      <AddButton label="Add Skill Card" onClick={() => u({ cards: [...data.cards, { icon: "⚡", img: "", name: "New Skill", category: "Frontend" }] })} />
    </div>
  );
}

// Inline image upload for skill cards
function SkillImageUpload({ current, onUpload, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) onUpload(json.url);
    } catch (e) { alert("Upload failed: " + e.message); }
    setUploading(false);
  };

  return (
    <div className="mt-2">
      {current ? (
        <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
          <img src={current} alt="" style={{ height: 32, width: 32, objectFit: "contain" }} />
          <p className="text-xs text-slate-400 flex-1 truncate">{current.split("/").pop()}</p>
          <button
            onClick={onRemove}
            className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: "10px" }} /> Remove
          </button>
        </div>
      ) : (
        <label
          className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all"
          style={{ border: "1px dashed rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.04)", color: "#a78bfa" }}
        >
          {uploading
            ? <><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "12px" }} /><span className="text-xs">Uploading...</span></>
            : <><i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "12px" }} /><span className="text-xs font-semibold">Upload PNG / SVG image</span></>
          }
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.svg,.webp"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

// ── ProjectsTab ───────────────────────────────────────────────
export function ProjectsTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("projects", patch);
  const [openIdx, setOpenIdx] = useState(null);

  const updateProject = (i, patch) => u({ items: data.items.map((p, j) => j === i ? { ...p, ...patch } : p) });
  const updateCS = (i, patch) => u({ items: data.items.map((p, j) => j === i ? { ...p, caseStudy: { ...p.caseStudy, ...patch } } : p) });
  const updateTechStack = (pi, si, field, val) => {
    u({ items: data.items.map((p, j) => {
      if (j !== pi) return p;
      const techStack = p.caseStudy.techStack.map((t, k) => k === si ? { ...t, [field]: val } : t);
      return { ...p, caseStudy: { ...p.caseStudy, techStack } };
    })});
  };

  return (
    <div>
      <TabHeader icon="fa-briefcase" title="Projects" desc="Add, edit, and manage your featured portfolio projects." iconColor="#f472b6" iconBg="rgba(244,114,182,0.2)" />

      <Field label="Section Title" icon="fa-heading" value={data.title} onChange={(v) => u({ title: v })} placeholder="Featured Work" />

      <SectionDivider title="Project Cards" icon="fa-rectangle-list" />

      {data.items.length === 0 && (
        <EmptyState icon="fa-folder-open" message="No projects yet." action={
          <AddButton label="Add First Project" onClick={() => u({ items: [{
            id: Date.now(), emoji: "🚀", img: "", title: "New Project", description: "Project description.", tags: ["React"], demo: "#", github: "#",
            caseStudy: { overview: "", problem: "", solution: "", challenges: "", outcome: "", techStack: [], year: "2025", duration: "", role: "" }
          }] })} />
        } />
      )}

      <div className="space-y-2 mb-2">
        {data.items.map((proj, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={proj.id} className="rounded-2xl overflow-hidden transition-all" style={{ border: isOpen ? "1px solid rgba(167,139,250,0.25)" : "1px solid rgba(255,255,255,0.07)", background: isOpen ? "rgba(167,139,250,0.04)" : "rgba(255,255,255,0.02)" }}>
              {/* Header */}
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer bg-transparent border-none"
              >
                {/* Icon preview */}
                {proj.img
                  ? <img src={proj.img} alt="" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6, background: "rgba(255,255,255,0.05)" }} />
                  : <span className="text-2xl leading-none flex-shrink-0">{proj.emoji || "📁"}</span>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-200 truncate">{proj.title || "Untitled"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {proj.tags.slice(0, 3).map((t) => <span key={t} className="text-xs text-slate-600">{t}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); u({ items: data.items.filter((_, j) => j !== i) }); }}
                    className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                    style={{ color: "#64748b", background: "rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b";  e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    <i className="fa-solid fa-trash-can" style={{ fontSize: "11px" }} />
                  </button>
                  <i className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ fontSize: "11px", color: "#475569" }} />
                </div>
              </button>

              {/* Body */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

                  <SectionDivider title="Basic Info" icon="fa-circle-info" />

                  {/* Emoji / Image switcher */}
                  <ImageOrEmoji
                    label="Project Icon"
                    emojiValue={proj.emoji}
                    imgValue={proj.img || ""}
                    onEmojiChange={(v) => updateProject(i, { emoji: v })}
                    onImgChange={(v) => updateProject(i, { img: v })}
                    helper="Use an emoji or upload a PNG/SVG image as the project icon."
                  />

                  <div className="mb-3">
                    <label className={labelCls}>Project Title</label>
                    <DIn value={proj.title} onChange={(v) => updateProject(i, { title: v })} placeholder="My Awesome Project" />
                  </div>

                  <div className="mb-3">
                    <label className={labelCls}>Short Description</label>
                    <DTa value={proj.description} onChange={(v) => updateProject(i, { description: v })} placeholder="A brief description..." />
                  </div>

                  <div className="mb-3">
                    <label className={labelCls}>
                      <i className="fa-solid fa-tags" style={{ fontSize: "10px" }} />
                      Tags <span className="text-slate-700 font-normal normal-case">(comma-separated)</span>
                    </label>
                    <DIn value={proj.tags.join(", ")} onChange={(v) => updateProject(i, { tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="React, Node.js, MongoDB" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <SectionDivider title="Links" icon="fa-link" />
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <div>
                      <label className={labelCls}><i className="fa-solid fa-globe" style={{ fontSize: "10px" }} />Live Demo URL</label>
                      <DIn value={proj.demo}   onChange={(v) => updateProject(i, { demo: v })}   placeholder="https://..." />
                    </div>
                    <div>
                      <label className={labelCls}><i className="fa-brands fa-github" style={{ fontSize: "10px" }} />GitHub URL</label>
                      <DIn value={proj.github} onChange={(v) => updateProject(i, { github: v })} placeholder="https://github.com/..." />
                    </div>
                  </div>

                  <SectionDivider title="Case Study" icon="fa-book-open" />
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { key: "year",     label: "Year",      icon: "fa-calendar", ph: "2024"     },
                      { key: "duration", label: "Duration",  icon: "fa-clock",    ph: "3 months" },
                      { key: "role",     label: "Your Role", icon: "fa-user-tie", ph: "Developer"},
                    ].map(({ key, label, icon, ph }) => (
                      <div key={key}>
                        <label className={labelCls}><i className={`fa-solid ${icon}`} style={{ fontSize: "9px" }} />{label}</label>
                        <DIn value={proj.caseStudy?.[key] || ""} onChange={(v) => updateCS(i, { [key]: v })} placeholder={ph} />
                      </div>
                    ))}
                  </div>

                  {[
                    { key: "overview",   label: "Overview",         icon: "fa-binoculars",          ph: "What is this project?" },
                    { key: "problem",    label: "The Problem",      icon: "fa-triangle-exclamation", ph: "What problem does it solve?" },
                    { key: "solution",   label: "The Solution",     icon: "fa-wand-magic-sparkles",  ph: "How did you solve it?" },
                    { key: "challenges", label: "Challenges",       icon: "fa-mountain",             ph: "What was hard to build?" },
                    { key: "outcome",    label: "Outcome & Impact", icon: "fa-trophy",               ph: "What were the results?" },
                  ].map(({ key, label, icon, ph }) => (
                    <div key={key} className="mb-3">
                      <label className={labelCls}><i className={`fa-solid ${icon}`} style={{ fontSize: "10px" }} />{label}</label>
                      <DTa value={proj.caseStudy?.[key] || ""} onChange={(v) => updateCS(i, { [key]: v })} placeholder={ph} />
                    </div>
                  ))}

                  <SectionDivider title="Tech Stack" icon="fa-layer-group" />
                  <div className="space-y-2 mb-2">
                    {(proj.caseStudy?.techStack || []).map((row, si) => (
                      <div key={si} className="flex gap-2 items-center">
                        <DIn value={row.label} onChange={(v) => updateTechStack(i, si, "label", v)} placeholder="Layer (e.g. Frontend)" style={{ width: 130, flex: "none" }} />
                        <DIn value={row.value} onChange={(v) => updateTechStack(i, si, "value", v)} placeholder="Technologies used" />
                        <RemoveButton onClick={() => { const techStack = (proj.caseStudy?.techStack || []).filter((_, k) => k !== si); updateCS(i, { techStack }); }} />
                      </div>
                    ))}
                  </div>
                  <AddButton label="Add Tech Row" icon="fa-plus" onClick={() => { const techStack = [...(proj.caseStudy?.techStack || []), { label: "", value: "" }]; updateCS(i, { techStack }); }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddButton label="Add New Project" icon="fa-folder-plus" onClick={() => u({ items: [...data.items, {
        id: Date.now(), emoji: "🚀", img: "", title: "New Project", description: "Short description.", tags: ["React"], demo: "#", github: "#",
        caseStudy: { overview: "", problem: "", solution: "", challenges: "", outcome: "", techStack: [], year: "2025", duration: "", role: "" },
      }] })} />
    </div>
  );
}

// ── ContactTab ────────────────────────────────────────────────
export function ContactTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("contact", patch);
  return (
    <div>
      <TabHeader icon="fa-envelope" title="Contact" desc="Update how visitors can get in touch with you." iconColor="#fb923c" iconBg="rgba(251,146,60,0.2)" />
      <Field label="Section Title"    icon="fa-heading"      value={data.title}        onChange={(v) => u({ title: v })}        placeholder="Let's Work Together" />
      <SectionDivider title="Contact Details" icon="fa-address-card" />
      <Field label="Email Address"    icon="fa-at"           value={data.email}        onChange={(v) => u({ email: v })}        placeholder="you@example.com"           helper="Displayed as a mailto link." />
      <Field label="Location"         icon="fa-location-dot" value={data.location}     onChange={(v) => u({ location: v })}     placeholder="City, Country"             helper="Your general location." />
      <Field label="Availability"     icon="fa-circle-check" value={data.availability} onChange={(v) => u({ availability: v })} placeholder="Open to freelance & ft"     helper="Shown as a status badge." />
      <div className="mt-2 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-500" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)" }}>
        <i className="fa-solid fa-shield-halved mt-0.5" style={{ color: "#34d399", fontSize: "11px" }} />
        <span>Email is displayed as plain text. Consider a form service to reduce spam.</span>
      </div>
    </div>
  );
}

// ── FooterTab ─────────────────────────────────────────────────
const autoDetectIcon = (url, currentIcon) => {
  // Only auto-detect if it's empty, default link emoji, or we already auto-filled something known but the user changed the URL.
  if (currentIcon !== "🔗" && currentIcon.trim() !== "") return currentIcon;
  
  const l = url.toLowerCase();
  if (l.includes("twitter.com") || l.includes("x.com")) return "fa-brands fa-x-twitter";
  if (l.includes("linkedin.com")) return "fa-brands fa-linkedin-in";
  if (l.includes("github.com")) return "fa-brands fa-github";
  if (l.includes("instagram.com")) return "fa-brands fa-instagram";
  if (l.includes("facebook.com")) return "fa-brands fa-facebook-f";
  if (l.includes("youtube.com")) return "fa-brands fa-youtube";
  if (l.includes("dribbble.com")) return "fa-brands fa-dribbble";
  if (l.includes("behance.net")) return "fa-brands fa-behance";
  if (l.includes("twitch.tv")) return "fa-brands fa-twitch";
  if (l.includes("discord.com") || l.includes("discord.gg")) return "fa-brands fa-discord";
  if (l.includes("medium.com")) return "fa-brands fa-medium";
  if (l.includes("mailto:")) return "fa-solid fa-envelope";
  return currentIcon;
};

export function FooterTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("footer", patch);
  return (
    <div>
      <TabHeader icon="fa-shoe-prints" title="Footer" desc="Manage footer text, style, and social links." iconColor="#2dd4bf" iconBg="rgba(45,212,191,0.15)" />
      <Field label="Footer Text" icon="fa-copyright" value={data.text} onChange={(v) => u({ text: v })} placeholder="© 2025 Your Name · Made with ✦" helper="Supports emoji." />
      <Select label="Footer Style" icon="fa-palette" value={data.style} options={["glass", "minimal", "gradient"]} onChange={(v) => u({ style: v })} />
      <SectionDivider title="Social Links" icon="fa-share-nodes" />
      <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5"><i className="fa-solid fa-circle-info" style={{ fontSize: "10px" }} />Icon: FontAwesome class (e.g. 'fa-brands fa-github'), emoji, or short text.</p>
      {data.socials.length === 0 && <EmptyState icon="fa-share-nodes" message="No social links yet." />}
      <div className="space-y-2 mb-2">
        {data.socials.map((s, i) => (
          <FieldCard key={i}>
            <div className="flex items-center gap-2">
              <DIn value={s.icon} onChange={(v) => { const socials = data.socials.map((x, j) => j === i ? { ...x, icon: v } : x); u({ socials }); }} placeholder="𝕏" style={{ width: 52, textAlign: "center", flex: "none" }} />
              <DIn 
                value={s.url}  
                onChange={(v) => { 
                  const socials = data.socials.map((x, j) => {
                    if (j === i) {
                      return { ...x, url: v, icon: autoDetectIcon(v, x.icon) };
                    }
                    return x;
                  }); 
                  u({ socials }); 
                }} 
                placeholder="https://twitter.com/..." 
              />
              <RemoveButton onClick={() => u({ socials: data.socials.filter((_, j) => j !== i) })} />
            </div>
          </FieldCard>
        ))}
      </div>
      <AddButton label="Add Social Link" onClick={() => u({ socials: [...data.socials, { icon: "🔗", url: "" }] })} />
    </div>
  );
}

// ── SEOTab ────────────────────────────────────────────────────
export function SEOTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("seo", patch);
  return (
    <div>
      <TabHeader icon="fa-magnifying-glass" title="SEO & Meta" desc="Control how your site appears in search engines and social media." iconColor="#94a3b8" iconBg="rgba(148,163,184,0.15)" />
      <SectionDivider title="Identity" icon="fa-id-card" />
      <Field label="Your Full Name"   icon="fa-user"       value={data.name}          onChange={(v) => u({ name: v })}          placeholder="John Doe"                    helper="Used in structured data (JSON-LD) for Google." />
      <Field label="Page Title"       icon="fa-t"          value={data.title}         onChange={(v) => u({ title: v })}         placeholder="John Doe — Full-Stack Dev"   helper="Browser tab + search results. Keep under 60 chars."  maxLength={60} />
      <SectionDivider title="Search & Social" icon="fa-share-from-square" />
      <Field label="Meta Description" icon="fa-align-left" value={data.description}   onChange={(v) => u({ description: v })}   multiline placeholder="A passionate developer..." helper="Ideal: 120–160 characters." maxLength={160} />
      <Field label="Keywords"         icon="fa-tags"       value={data.keywords}      onChange={(v) => u({ keywords: v })}      multiline placeholder="React, Node.js, Web Developer, ..." helper="Comma-separated. Less critical for modern SEO." />
      <SectionDivider title="Open Graph / Social Cards" icon="fa-image" />
      <Field label="Site URL"         icon="fa-globe"      value={data.siteUrl}       onChange={(v) => u({ siteUrl: v })}       placeholder="https://yourdomain.com"      helper="Canonical URL." />
      <Field label="OG Image URL"     icon="fa-image"      value={data.ogImage}       onChange={(v) => u({ ogImage: v })}       placeholder="https://yourdomain.com/og.jpg" helper="1200×630px recommended." />
      <Field label="Twitter Handle"   icon="fa-at"         value={data.twitterHandle} onChange={(v) => u({ twitterHandle: v })} placeholder="@yourusername"               helper="With the @ symbol." />

      {/* Google preview */}
      <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.12)" }}>
        <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
          <i className="fa-solid fa-eye" style={{ color: "#60a5fa", fontSize: "11px" }} />Google Search Preview
        </p>
        <p className="text-sm font-medium" style={{ color: "#60a5fa" }}>{data.title || "Your Page Title"}</p>
        <p className="text-xs" style={{ color: "#4ade80", opacity: 0.7 }}>{data.siteUrl || "https://yourdomain.com"}</p>
        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{data.description || "Your meta description will appear here..."}</p>
      </div>
    </div>
  );
}

// ── THEME TABS ────────────────────────────────────────────────
export function ThemeTab({ data, onUpdate }) {
  const u = (patch) => onUpdate("theme", patch);
  const val = data?.theme?.color || "violet";
  const customColor = data?.theme?.customColor || "#a78bfa";

  const themes = [
    { id: "violet",       label: "Cosmic Violet", color: "#a78bfa" },
    { id: "emerald",      label: "Neon Emerald",  color: "#34d399" },
    { id: "rose",         label: "Cyber Rose",    color: "#fda4af" },
    { id: "amber",        label: "Solar Amber",   color: "#fbbf24" },
    { id: "racing_green", label: "Racing Green",  color: "#4ade80" },
  ];

  return (
    <div>
      <TabHeader icon="fa-palette" title="Global Theme" desc="Choose a custom color palette for your entire portfolio." />
      <div className="p-6">
        <label className="block text-xs font-bold text-slate-400 mb-4 tracking-wider uppercase">Select Accent Palette</label>
        
        <div className="grid grid-cols-2 gap-4">
          {themes.map(t =>(
            <button
              key={t.id}
              onClick={() => u({ color: t.id })}
              className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${val === t.id ? "bg-white/10" : "bg-transparent hover:bg-white/5"}`}
              style={{ borderColor: val === t.id ? t.color : "rgba(255,255,255,0.05)" }}
            >
              <span className="font-bold text-sm text-[var(--theme-primary,auto)] text-slate-200">{t.label}</span>
              <div className="w-6 h-6 rounded-full" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
            </button>
          ))}
          
          {/* Custom Color Selector */}
          <button
            onClick={() => val !== "custom" && u({ color: "custom" })}
            className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all overflow-hidden relative cursor-pointer ${val === "custom" ? "bg-white/10" : "bg-transparent hover:bg-white/5"}`}
            style={{ borderColor: val === "custom" ? customColor : "rgba(255,255,255,0.05)" }}
          >
            <span className="font-bold text-sm text-[var(--theme-primary,auto)] text-slate-200">Custom Color</span>
            <div 
              className="relative w-6 h-6 rounded-full overflow-hidden" 
              style={{ boxShadow: val === "custom" ? `0 0 10px ${customColor}` : "none" }}
            >
              <input 
                type="color" 
                value={customColor}
                onChange={(e) => u({ color: "custom", customColor: e.target.value })}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer border-none p-0 outline-none"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
