// src/components/cms/AdminPage.jsx
// Full-page CMS admin — accessible at /admin
import { useState } from "react";
import { NavTab, HomeTab, AboutTab, SkillsTab, ProjectsTab, ContactTab, FooterTab, SEOTab, ThemeTab } from "./CMSTabs";
import AssetsTab from "./AssetsTab";
import SettingsTab, { getActivePassword } from "./SettingsTab";

// ── Tab definitions with Font Awesome icons ───────────────────
const TABS = [
  { id: "nav",      label: "Navigation", icon: "fa-compass",            color: "#60a5fa", desc: "Navbar & logo"      },
  { id: "theme",    label: "Theme",      icon: "fa-palette",            color: "#8b5cf6", desc: "Global colors"      },
  { id: "home",     label: "Hero",       icon: "fa-house",              color: "#a78bfa", desc: "Landing section"    },
  { id: "about",    label: "About",      icon: "fa-user",               color: "#34d399", desc: "Bio & stats"        },
  { id: "skills",   label: "Skills",     icon: "fa-screwdriver-wrench", color: "#fbbf24", desc: "Tech stack"         },
  { id: "projects", label: "Projects",   icon: "fa-briefcase",          color: "#f472b6", desc: "Portfolio items"    },
  { id: "contact",  label: "Contact",    icon: "fa-envelope",           color: "#fb923c", desc: "Contact details"    },
  { id: "footer",   label: "Footer",     icon: "fa-shoe-prints",        color: "#2dd4bf", desc: "Footer & socials"   },
  { id: "seo",      label: "SEO",        icon: "fa-magnifying-glass",   color: "#94a3b8", desc: "Meta & open graph"  },
  { id: "assets",   label: "Assets",     icon: "fa-images",             color: "#f472b6", desc: "Image library"      },
  { id: "settings", label: "Settings",   icon: "fa-shield-halved",      color: "#fbbf24", desc: "Password & prefs"   },
];

// ── Password Gate ─────────────────────────────────────────────
function PasswordGate({ onSuccess }) {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [show, setShow]   = useState(false);

  const submit = () => {
    if (pw === getActivePassword()) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setPw("");
      setTimeout(() => { setError(false); setShake(false); }, 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: "#020008" }}
    >
      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div
        className={`relative w-full max-w-md mx-4 ${shake ? "cms-shake" : ""}`}
        style={{
          background: "rgba(10, 6, 25, 0.95)",
          border: "1px solid rgba(167,139,250,0.15)",
          borderRadius: "24px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(167,139,250,0.08)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* Card top accent line */}
        <div style={{ height: 2, borderRadius: "24px 24px 0 0", background: "linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)", backgroundSize: "200% 100%", animation: "gradientShift 3s ease infinite" }} />

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 relative"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))", border: "1px solid rgba(167,139,250,0.25)" }}
            >
              <i className="fa-solid fa-gear" style={{ fontSize: "2rem", color: "#a78bfa" }} />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full"
                style={{ background: "#020008", border: "2px solid rgba(167,139,250,0.3)" }}
              >
                <i className="fa-solid fa-lock" style={{ fontSize: "8px", color: "#a78bfa" }} />
              </div>
            </div>
            <h1 className="font-display font-extrabold text-2xl grad-text-2 mb-2">Site Editor</h1>
            <p className="text-slate-500 text-sm font-body">Enter your admin password to continue</p>
          </div>

          {/* Password field */}
          <div className="relative mb-4">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <i className="fa-solid fa-key" style={{ fontSize: "13px", color: "#475569" }} />
            </div>
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Enter password"
              autoFocus
              className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-white/5 border text-slate-200 text-sm outline-none transition-all font-body"
              style={{
                borderColor: error ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)",
                boxShadow: error ? "0 0 0 3px rgba(248,113,113,0.08)" : pw.length > 0 ? "0 0 0 3px rgba(167,139,250,0.08)" : "none",
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = "rgba(167,139,250,0.6)"; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer p-1"
            >
              <i className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "13px" }} />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-4 text-sm"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#fca5a5" }}
            >
              <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "13px" }} />
              Incorrect password — please try again.
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; e.currentTarget.style.transform = "none"; }}
          >
            <i className="fa-solid fa-unlock" style={{ fontSize: "13px" }} />
            Unlock Editor
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-700 hover:text-slate-400 transition-colors"
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: "10px" }} />
            Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────
export default function AdminPage({ data, onUpdate, onReset }) {
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem("cms_authed") === "1");
  const [activeTab, setActiveTab] = useState("nav");
  const [saved, setSaved]         = useState(false);

  const handleAuth = () => {
    sessionStorage.setItem("cms_authed", "1");
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cms_authed");
    setAuthed(false);
  };

  const goHome = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Wrap onUpdate to show saved flash
  const handleUpdate = (section, patch) => {
    onUpdate(section, patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  if (!authed) return <PasswordGate onSuccess={handleAuth} />;

  const activeTabData = TABS.find((t) => t.id === activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "nav":      return <NavTab      data={data.nav}      onUpdate={handleUpdate} />;
      case "theme":    return <ThemeTab    data={data}          onUpdate={handleUpdate} />;
      case "home":     return <HomeTab     data={data.home}     onUpdate={handleUpdate} />;
      case "about":    return <AboutTab    data={data.about}    onUpdate={handleUpdate} />;
      case "skills":   return <SkillsTab   data={data.skills}   onUpdate={handleUpdate} />;
      case "projects": return <ProjectsTab data={data.projects} onUpdate={handleUpdate} />;
      case "contact":  return <ContactTab  data={data.contact}  onUpdate={handleUpdate} />;
      case "footer":   return <FooterTab   data={data.footer}   onUpdate={handleUpdate} />;
      case "seo":      return <SEOTab      data={data.seo}      onUpdate={handleUpdate} />;
      case "assets":   return <AssetsTab />;
      case "settings": return <SettingsTab />;
      default:         return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ background: "#020008" }}>

      {/* ── Top Header ──────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 h-14"
        style={{
          background: "rgba(6, 3, 18, 0.97)",
          borderBottom: "1px solid rgba(167,139,250,0.1)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.3))", border: "1px solid rgba(167,139,250,0.25)" }}
          >
            <i className="fa-solid fa-gear" style={{ color: "#a78bfa", fontSize: "13px" }} />
          </div>
          <div>
            <span className="font-display font-bold text-sm grad-text-2">Site Editor</span>
            <span className="text-slate-700 text-xs ml-2 hidden sm:inline">/ CMS</span>
          </div>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 ml-3 pl-3" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <i
              className={`fa-solid ${activeTabData?.icon} text-xs`}
              style={{ color: activeTabData?.color || "#a78bfa" }}
            />
            <span className="text-xs text-slate-400 font-medium">{activeTabData?.label}</span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Save flash */}
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-all duration-300"
            style={{
              opacity: saved ? 1 : 0,
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              color: "#34d399",
              transform: saved ? "scale(1)" : "scale(0.9)",
            }}
          >
            <i className="fa-solid fa-check" style={{ fontSize: "10px" }} />
            Saved
          </div>

          <button
            onClick={goHome}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: "10px" }} />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          <button
            onClick={() => { if (window.confirm("Reset ALL content to defaults? This cannot be undone.")) onReset(); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <i className="fa-solid fa-rotate-left" style={{ fontSize: "10px" }} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: "10px" }} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ─────────────────────────────────── */}
        <aside
          className="w-52 flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ background: "rgba(6,3,18,0.95)", borderRight: "1px solid rgba(167,139,250,0.09)" }}
        >
          <div className="p-3 pt-4 space-y-0.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all relative group"
                  style={{
                    background:    isActive ? `rgba(${hexToRgb(tab.color)}, 0.1)` : "transparent",
                    border:        isActive ? `1px solid rgba(${hexToRgb(tab.color)}, 0.2)` : "1px solid transparent",
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: tab.color }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all"
                    style={{
                      background: isActive ? `rgba(${hexToRgb(tab.color)}, 0.2)` : "rgba(255,255,255,0.04)",
                      border:     isActive ? `1px solid rgba(${hexToRgb(tab.color)}, 0.3)` : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <i
                      className={`fa-solid ${tab.icon}`}
                      style={{
                        fontSize: "11px",
                        color: isActive ? tab.color : "#475569",
                        transition: "color 0.2s",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-semibold leading-tight transition-colors"
                      style={{ color: isActive ? "#e2e8f0" : "#64748b" }}
                    >
                      {tab.label}
                    </div>
                    <div className="text-xs text-slate-700 leading-tight mt-0.5 truncate group-hover:text-slate-600 transition-colors">
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div className="mt-auto p-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.7)" }}
              />
              <span className="text-xs text-slate-700">localStorage · auto-save</span>
            </div>
          </div>
        </aside>

        {/* ── Content Area ──────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto cms-scroll relative" style={{ background: "#020008" }}>

          {/* Sticky section banner */}
          <div
            className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3.5"
            style={{
              background: "rgba(2,0,8,0.92)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
              style={{ background: `rgba(${hexToRgb(activeTabData?.color || "#a78bfa")}, 0.15)`, border: `1px solid rgba(${hexToRgb(activeTabData?.color || "#a78bfa")}, 0.25)` }}
            >
              <i
                className={`fa-solid ${activeTabData?.icon}`}
                style={{ fontSize: "13px", color: activeTabData?.color || "#a78bfa" }}
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-100">{activeTabData?.label} Settings</h2>
              <p className="text-xs text-slate-600">{activeTabData?.desc}</p>
            </div>

            {/* Right: view on site */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "10px" }} />
              <span className="hidden sm:inline">Preview Site</span>
            </a>
          </div>

          {/* Tab content */}
          <div className="p-6 max-w-2xl mx-auto">
            {renderTab()}
          </div>
        </main>

        {/* ── Right Tips Panel ──────────────────────────────── */}
        <aside
          className="hidden xl:flex w-56 flex-shrink-0 flex-col"
          style={{ background: "rgba(6,3,18,0.95)", borderLeft: "1px solid rgba(167,139,250,0.09)" }}
        >
          <div className="p-4 pt-5">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-question" style={{ fontSize: "10px" }} />
              Quick Help
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: "fa-floppy-disk",
                  color: "#34d399",
                  title: "Auto-Save",
                  text: "Every keystroke is instantly saved to your browser's localStorage.",
                },
                {
                  icon: "fa-eye",
                  color: "#60a5fa",
                  title: "Live Preview",
                  text: "Open the Portfolio link in another tab to see changes in real time.",
                },
                {
                  icon: "fa-rotate-left",
                  color: "#fb923c",
                  title: "Reset",
                  text: "The Reset button in the header restores all default content.",
                },
                {
                  icon: "fa-lock",
                  color: "#a78bfa",
                  title: "Session",
                  text: "Your admin session stays active until you logout or close the tab.",
                },
                {
                  icon: "fa-database",
                  color: "#f472b6",
                  title: "Storage",
                  text: "Data is persisted to content.json on your machine. It survives browser resets.",
                },
              ].map(({ icon, color, title, text }) => (
                <div key={title} className="flex gap-2.5">
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg mt-0.5"
                    style={{ background: `rgba(${hexToRgb(color)}, 0.12)` }}
                  >
                    <i className={`fa-solid ${icon}`} style={{ fontSize: "10px", color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">{title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div
            className="m-4 mt-auto p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-keyboard" style={{ fontSize: "10px" }} />
              Shortcuts
            </p>
            <div className="space-y-1.5">
              {[
                { keys: "↵", label: "Confirm password" },
              ].map(({ keys, label }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">{label}</span>
                  <kbd
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", fontFamily: "monospace" }}
                  >
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function hexToRgb(hex) {
  if (!hex) return "167,139,250";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "167,139,250";
}
