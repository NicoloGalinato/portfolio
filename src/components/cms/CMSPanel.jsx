// src/components/cms/CMSPanel.jsx
// Password-protected CMS panel. Access via /admin route.
import { useState } from "react";
import { CMS_PASSWORD } from "../../data/defaultData";
import { NavTab, HomeTab, AboutTab, SkillsTab, ProjectsTab, ContactTab, FooterTab, SEOTab } from "./CMSTabs";

const TABS = [
  { id:"nav",      label:"🧭 Nav"      },
  { id:"home",     label:"🏠 Home"     },
  { id:"about",    label:"👤 About"    },
  { id:"skills",   label:"🛠 Skills"   },
  { id:"projects", label:"💼 Projects" },
  { id:"contact",  label:"📬 Contact"  },
  { id:"footer",   label:"🦶 Footer"   },
  { id:"seo",      label:"🔍 SEO"      },
];

// ── Password Gate ─────────────────────────────────────────────
function PasswordGate({ onSuccess }) {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (pw === CMS_PASSWORD) { onSuccess(); }
    else { setError(true); setPw(""); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative glass rounded-3xl p-8 w-full max-w-sm animate-modal-in"
        style={{ border:"1px solid rgba(167,139,250,0.2)" }}>
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="font-display font-extrabold text-xl grad-text-2">Admin Access</h2>
          <p className="text-slate-500 text-sm mt-1">Enter your CMS password to continue</p>
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          autoFocus
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-slate-200 text-sm outline-none transition-all mb-3 font-body
            ${error ? "border-red-400/60 shake" : "border-white/10 focus:border-violet-400/60"}`}
        />
        {error && <p className="text-red-400 text-xs text-center mb-3">Incorrect password</p>}
        <button onClick={submit} className="btn-grad w-full text-white font-semibold py-3 rounded-full text-sm">
          Unlock Editor
        </button>
      </div>
    </div>
  );
}

// ── CMS Panel Shell ───────────────────────────────────────────
export default function CMSPanel({ data, onUpdate, onReset, onClose }) {
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem("cms_authed") === "1";
  });
  const [activeTab, setActiveTab] = useState("nav");

  const handleAuth = () => {
    sessionStorage.setItem("cms_authed","1");
    setAuthed(true);
  };

  if (!authed) return <PasswordGate onSuccess={handleAuth} />;

  const handleLogout = () => {
    sessionStorage.removeItem("cms_authed");
    setAuthed(false);
    onClose();
  };

  const renderTab = () => {
    switch (activeTab) {
      case "nav":      return <NavTab      data={data.nav}      onUpdate={onUpdate} />;
      case "home":     return <HomeTab     data={data.home}     onUpdate={onUpdate} />;
      case "about":    return <AboutTab    data={data.about}    onUpdate={onUpdate} />;
      case "skills":   return <SkillsTab   data={data.skills}   onUpdate={onUpdate} />;
      case "projects": return <ProjectsTab data={data.projects} onUpdate={onUpdate} />;
      case "contact":  return <ContactTab  data={data.contact}  onUpdate={onUpdate} />;
      case "footer":   return <FooterTab   data={data.footer}   onUpdate={onUpdate} />;
      case "seo":      return <SEOTab      data={data.seo}      onUpdate={onUpdate} />;
      default:         return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[340px] flex flex-col bg-slate-950/95 border-l border-violet-400/15 animate-slide-right"
        style={{ backdropFilter:"blur(32px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <div className="font-display font-bold text-base grad-text-2">⚙ Site Editor</div>
            <div className="text-slate-600 text-xs mt-0.5 font-body">Auto-saved · Admin</div>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => { if(window.confirm("Reset all content?")) onReset(); }}
              className="text-xs text-slate-500 border border-white/8 px-3 py-1 rounded-full hover:text-red-400 hover:border-red-400/30 transition-colors">
              Reset
            </button>
            <button onClick={handleLogout}
              className="text-xs text-slate-500 border border-white/8 px-3 py-1 rounded-full hover:text-yellow-400 hover:border-yellow-400/30 transition-colors">
              Logout
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none px-1">✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 px-4 py-3 border-b border-white/5">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium
                ${activeTab===tab.id
                  ? "bg-violet-500/25 text-violet-200 border border-violet-400/35"
                  : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/8"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 cms-scroll">{renderTab()}</div>

        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-slate-700 text-xs text-center font-body">Changes saved to localStorage</p>
        </div>
      </div>
    </div>
  );
}
