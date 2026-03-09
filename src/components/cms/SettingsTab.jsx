// src/components/cms/SettingsTab.jsx
// ─────────────────────────────────────────────────────────────
// CMS Settings — change password, display preferences, danger zone.
// Password is stored in defaultData.js; this UI updates localStorage
// so changes persist for the session.
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { CMS_PASSWORD } from "../../data/defaultData";

// ── Stored password (persisted in localStorage) ───────────────
const PW_KEY = "cms_password_override";

export function getActivePassword() {
  return localStorage.getItem(PW_KEY) || CMS_PASSWORD;
}

// ── SettingsTab ───────────────────────────────────────────────
export default function SettingsTab() {
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [pwStatus,   setPwStatus]   = useState(null); // "success" | "error"
  const [pwMsg,      setPwMsg]      = useState("");

  const changePassword = () => {
    const active = getActivePassword();
    setPwStatus(null);

    if (currentPw !== active) {
      setPwStatus("error");
      setPwMsg("Current password is incorrect.");
      return;
    }
    if (newPw.length < 6) {
      setPwStatus("error");
      setPwMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwStatus("error");
      setPwMsg("New passwords do not match.");
      return;
    }

    localStorage.setItem(PW_KEY, newPw);
    setPwStatus("success");
    setPwMsg("Password changed! You'll use the new password next time you log in.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const resetPassword = () => {
    if (!window.confirm("Reset password back to the default from defaultData.js?")) return;
    localStorage.removeItem(PW_KEY);
    setPwStatus("success");
    setPwMsg("Password has been reset to the default value.");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(251,191,36,0.1))", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <i className="fa-solid fa-shield-halved" style={{ color: "#fbbf24", fontSize: "16px" }} />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-slate-200 mb-0.5">Settings</h3>
          <p className="text-xs text-slate-500">Manage your CMS password and admin preferences.</p>
        </div>
      </div>

      {/* ── Change Password ──────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-lock" style={{ color: "#a78bfa", fontSize: "13px" }} />
            <h4 className="font-display font-bold text-sm text-slate-200">Change Password</h4>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">The new password is saved in localStorage and overrides the default.</p>
        </div>

        <div className="p-5 space-y-3">
          {/* Current password */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-key text-violet-400" style={{ fontSize: "10px" }} />
              Current Password
            </label>
            <PasswordInput value={currentPw} onChange={setCurrentPw} show={showCur} onToggle={() => setShowCur(!showCur)} placeholder="Enter current password" />
          </div>

          {/* New password */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-lock-open text-violet-400" style={{ fontSize: "10px" }} />
              New Password
            </label>
            <PasswordInput value={newPw} onChange={setNewPw} show={showNew} onToggle={() => setShowNew(!showNew)} placeholder="At least 6 characters" />
            {/* Strength indicator */}
            {newPw.length > 0 && <PasswordStrength password={newPw} />}
          </div>

          {/* Confirm */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-check-double text-violet-400" style={{ fontSize: "10px" }} />
              Confirm New Password
            </label>
            <PasswordInput value={confirmPw} onChange={setConfirmPw} show={showConf} onToggle={() => setShowConf(!showConf)} placeholder="Repeat new password" />
          </div>

          {/* Status message */}
          {pwStatus && (
            <div
              className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-xs"
              style={{
                background: pwStatus === "success" ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                border:     pwStatus === "success" ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(248,113,113,0.2)",
                color:      pwStatus === "success" ? "#6ee7b7" : "#fca5a5",
              }}
            >
              <i
                className={`fa-solid ${pwStatus === "success" ? "fa-circle-check" : "fa-circle-exclamation"} mt-0.5`}
                style={{ fontSize: "12px" }}
              />
              {pwMsg}
            </div>
          )}

          <button
            onClick={changePassword}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-1"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 24px rgba(124,58,237,0.5)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.3)"}
          >
            <i className="fa-solid fa-key" style={{ fontSize: "12px" }} />
            Change Password
          </button>
        </div>
      </div>

      {/* ── Danger Zone ──────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.03)" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(248,113,113,0.1)" }}>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation" style={{ color: "#f87171", fontSize: "13px" }} />
            <h4 className="font-display font-bold text-sm" style={{ color: "#fca5a5" }}>Danger Zone</h4>
          </div>
        </div>

        <div className="p-5 space-y-2">
          {/* Reset password */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-0.5">Reset Password Override</p>
              <p className="text-xs text-slate-600">Restores the password from <code className="text-violet-400 bg-white/5 px-1 rounded">defaultData.js</code>.</p>
            </div>
            <button
              onClick={resetPassword}
              className="flex-shrink-0 text-xs px-4 py-2 rounded-xl transition-all font-semibold"
              style={{ color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.06)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.06)"}
            >
              Reset
            </button>
          </div>

          <div style={{ height: 1, background: "rgba(248,113,113,0.08)" }} />

          {/* Clear all CMS data */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-0.5">Clear All CMS Data</p>
              <p className="text-xs text-slate-600">Wipes all portfolio content from localStorage and reloads the page.</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Clear ALL CMS data? This will reset everything to defaults.")) {
                  localStorage.removeItem("portfolio_cms_v3");
                  localStorage.removeItem(PW_KEY);
                  window.location.reload();
                }
              }}
              className="flex-shrink-0 text-xs px-4 py-2 rounded-xl transition-all font-semibold"
              style={{ color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.06)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.06)"}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div
        className="mt-4 p-3.5 rounded-xl flex items-start gap-2.5 text-xs"
        style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.1)", color: "#64748b" }}
      >
        <i className="fa-solid fa-circle-info mt-0.5" style={{ fontSize: "11px", color: "#3b82f6" }} />
        <span>
          The password change only affects your current browser. To permanently change the default password, edit <code className="text-violet-400">CMS_PASSWORD</code> in <code className="text-violet-400">src/data/defaultData.js</code>.
        </span>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
function PasswordInput({ value, onChange, show, onToggle, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <i
        className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ fontSize: "12px", color: "#475569" }}
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-body transition-all"
        style={{
          background:  "rgba(15, 10, 35, 0.85)",
          border:      focused ? "1px solid rgba(167,139,250,0.6)" : "1px solid rgba(255,255,255,0.1)",
          color:       "#e2e8f0",
          outline:     "none",
          boxShadow:   focused ? "0 0 0 3px rgba(167,139,250,0.08)" : "none",
        }}
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
        style={{ color: "#475569" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
      >
        <i className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "12px" }} />
      </button>
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: "6+ chars",     ok: password.length >= 6  },
    { label: "Uppercase",    ok: /[A-Z]/.test(password) },
    { label: "Number",       ok: /\d/.test(password)    },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const levels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#f87171", "#fbbf24", "#60a5fa", "#34d399"];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all"
            style={{ background: score >= i ? colors[score] : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {checks.map(({ label, ok }) => (
            <span key={label} className="text-xs flex items-center gap-1" style={{ color: ok ? "#34d399" : "#475569" }}>
              <i className={`fa-solid ${ok ? "fa-check" : "fa-xmark"}`} style={{ fontSize: "9px" }} />
              {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className="text-xs font-semibold" style={{ color: colors[score] }}>{levels[score]}</span>
        )}
      </div>
    </div>
  );
}
