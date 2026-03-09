// src/components/cms/CMSFields.jsx
// ─────────────────────────────────────────────────────────────
// Premium CMS form primitives — dark inputs, icon labels, image uploader
// ─────────────────────────────────────────────────────────────
import { useState, useRef } from "react";

// ── Shared Styles ─────────────────────────────────────────────
// NOTE: Using inline style for bg to avoid Tailwind opacity utility quirk
const INPUT_STYLE = {
  background:  "rgba(15, 10, 35, 0.85)",
  border:      "1px solid rgba(255,255,255,0.1)",
  color:       "#e2e8f0",
  borderRadius: "12px",
  outline:     "none",
  transition:  "border-color 0.2s, box-shadow 0.2s",
  fontSize:    "0.875rem",
  fontFamily:  "inherit",
  width:       "100%",
};

export const INPUT_FOCUS_STYLE = {
  borderColor: "rgba(167,139,250,0.6)",
  boxShadow:   "0 0 0 3px rgba(167,139,250,0.08)",
};

// Utility: a base className we still attach for padding/radius/font
export const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all font-body placeholder-slate-600";

const labelCls =
  "flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2";

// ── StyledInput ───────────────────────────────────────────────
// Wraps a plain <input> with correct dark styling + focus glow
function StyledInput({ value, onChange, placeholder, maxLength, type = "text", style = {}, className = "", onFocus, onBlur, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${inputCls} ${className}`}
      style={{
        ...INPUT_STYLE,
        ...(focused ? INPUT_FOCUS_STYLE : {}),
        ...style,
      }}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
      {...rest}
    />
  );
}

// ── StyledTextarea ────────────────────────────────────────────
function StyledTextarea({ value, onChange, placeholder, maxLength, style = {}, className = "", minHeight = 88 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${inputCls} resize-none ${className}`}
      style={{
        ...INPUT_STYLE,
        minHeight,
        lineHeight: 1.6,
        ...(focused ? INPUT_FOCUS_STYLE : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={()  => setFocused(false)}
    />
  );
}

// ── StyledSelect ──────────────────────────────────────────────
export function StyledSelect({ value, onChange, options, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-9 cursor-pointer`}
        style={{
          ...INPUT_STYLE,
          ...(focused ? INPUT_FOCUS_STYLE : {}),
          ...style,
        }}
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ background: "#0f0a1e", color: "#e2e8f0" }}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: "11px", color: "#64748b" }} />
    </div>
  );
}

// ── SectionDivider ─────────────────────────────────────────────
export function SectionDivider({ title, icon }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
        {icon && <i className={`fa-solid ${icon}`} style={{ fontSize: "10px" }} />}
        {title}
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.3), transparent)" }} />
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────
export function Field({ label, value, onChange, multiline = false, icon, helper, placeholder = "", maxLength }) {
  const len = (value || "").length;
  return (
    <div className="mb-4 group">
      <label className={labelCls}>
        {icon && <i className={`fa-solid ${icon} text-violet-400`} style={{ fontSize: "10px" }} />}
        {label}
        {maxLength && (
          <span className="ml-auto font-normal normal-case tracking-normal text-slate-700">{len}/{maxLength}</span>
        )}
      </label>
      {multiline
        ? <StyledTextarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} />
        : <StyledInput   value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} />
      }
      {helper && (
        <p className="mt-1.5 text-xs text-slate-600 flex items-start gap-1.5">
          <i className="fa-solid fa-circle-info mt-0.5" style={{ fontSize: "10px", color: "#475569" }} />
          {helper}
        </p>
      )}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, value, options, onChange, icon, helper }) {
  return (
    <div className="mb-4">
      <label className={labelCls}>
        {icon && <i className={`fa-solid ${icon} text-violet-400`} style={{ fontSize: "10px" }} />}
        {label}
      </label>
      <StyledSelect value={value} options={options} onChange={onChange} />
      {helper && (
        <p className="mt-1.5 text-xs text-slate-600 flex items-start gap-1.5">
          <i className="fa-solid fa-circle-info mt-0.5" style={{ fontSize: "10px", color: "#475569" }} />
          {helper}
        </p>
      )}
    </div>
  );
}

// ── FileUpload ───────────────────────────────────────────────
export function FileUpload({ label, value, onChange, icon = "fa-file-arrow-up", helper, accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg" }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) {
        onChange(json.url);
      } else {
        alert("Upload failed: " + (json.error || "unknown error"));
      }
    } catch (e) {
      alert("Upload failed: " + e.message);
    }
    setUploading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div className="mb-4">
      <label className={labelCls}>
        <i className={`fa-solid ${icon} text-violet-400`} style={{ fontSize: "10px" }} />
        {label}
      </label>
      
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true);  }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="relative flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl transition-all overflow-hidden"
        style={{
          border:     `2px dashed ${dragging ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.12)"}`,
          background: dragging ? "rgba(167,139,250,0.08)" : "rgba(15,10,35,0.6)",
          minHeight:  100,
          padding:    "1rem",
        }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "1.5rem", color: "#a78bfa" }} />
            <p className="text-xs text-slate-500">Uploading...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2 w-full text-center">
             <i className="fa-solid fa-file-circle-check text-2xl text-emerald-400" />
             <div className="text-xs text-slate-300 font-mono truncate max-w-full px-4">
               {value.split("/").pop()}
             </div>
             <button
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all mt-1"
              style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              <i className="fa-solid fa-trash-can" style={{ fontSize: "10px" }} /> Remove File
            </button>
          </div>
        ) : (
          <>
            <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-500" />
            <p className="text-sm font-semibold text-slate-400">Upload CV / Resume</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-tighter">PDF, DOCX, PNG</p>
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />

      {helper && (
        <p className="mt-1.5 text-xs text-slate-600 flex items-start gap-1.5">
          <i className="fa-solid fa-circle-info mt-0.5" style={{ fontSize: "10px", color: "#475569" }} />
          {helper}
        </p>
      )}
    </div>
  );
}

// ── ImageOrEmoji ──────────────────────────────────────────────
export function ImageOrEmoji({ label, emojiValue, imgValue, onEmojiChange, onImgChange, helper }) {
  const [mode, setMode]       = useState(imgValue ? "img" : "emoji");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    if (!/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file.name)) {
      alert("Only PNG, JPG, GIF, SVG or WebP files are supported.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) {
        onImgChange(json.url);
        setMode("img");
      } else {
        alert("Upload failed: " + (json.error || "unknown error"));
      }
    } catch (e) {
      alert("Upload failed: " + e.message);
    }
    setUploading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className={labelCls} style={{ margin: 0 }}>
          <i className="fa-solid fa-image text-violet-400" style={{ fontSize: "10px" }} />
          {label}
        </label>
        {/* Mode toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
        >
          {["emoji", "img"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="text-xs px-2.5 py-1 transition-all"
              style={{
                background: mode === m ? "rgba(167,139,250,0.2)" : "transparent",
                color:      mode === m ? "#c4b5fd" : "#64748b",
                border:     "none",
                cursor:     "pointer",
              }}
            >
              {m === "emoji" ? "😀 Emoji" : "🖼 Image"}
            </button>
          ))}
        </div>
      </div>

      {mode === "emoji" ? (
        <StyledInput
          value={emojiValue}
          onChange={(e) => onEmojiChange(e.target.value)}
          placeholder="👨‍💻"
          style={{ fontSize: "1.5rem", textAlign: "center", letterSpacing: "0.1em" }}
        />
      ) : (
        <div>
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true);  }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className="relative flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl transition-all overflow-hidden"
            style={{
              border:     `2px dashed ${dragging ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.12)"}`,
              background: dragging ? "rgba(167,139,250,0.08)" : "rgba(15,10,35,0.6)",
              minHeight:  120,
              padding:    "1rem",
            }}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "1.5rem", color: "#a78bfa" }} />
                <p className="text-xs text-slate-500">Uploading...</p>
              </div>
            ) : imgValue ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <img
                  src={imgValue}
                  alt="Uploaded"
                  style={{ maxHeight: 80, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }}
                />
                <p className="text-xs text-slate-600 truncate max-w-full text-center">
                  {imgValue.split("/").pop()}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); onImgChange(""); }}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
                  style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
                >
                  <i className="fa-solid fa-xmark" style={{ fontSize: "10px" }} /> Remove image
                </button>
              </div>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "1.75rem", color: "#475569" }} />
                <p className="text-sm font-semibold text-slate-400">Drop image here or click to upload</p>
                <p className="text-xs text-slate-600">PNG, JPG, SVG, WebP, GIF · Saved to src/assets/images</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.svg,.webp"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </div>
      )}
      {helper && (
        <p className="mt-1.5 text-xs text-slate-600 flex items-start gap-1.5">
          <i className="fa-solid fa-circle-info mt-0.5" style={{ fontSize: "10px", color: "#475569" }} />
          {helper}
        </p>
      )}
    </div>
  );
}

// ── FieldCard ──────────────────────────────────────────────────
export function FieldCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-4 mb-3 ${className}`}
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {children}
    </div>
  );
}

// ── AddButton ─────────────────────────────────────────────────
export function AddButton({ label, onClick, icon = "fa-plus" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-xs font-semibold mt-2 px-4 py-2.5 rounded-xl transition-all w-full justify-center"
      style={{ color: "#a78bfa", border: "1px dashed rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.04)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(167,139,250,0.1)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(167,139,250,0.04)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)"; }}
    >
      <i className={`fa-solid ${icon}`} style={{ fontSize: "10px" }} />
      {label}
    </button>
  );
}

// ── RemoveButton ──────────────────────────────────────────────
export function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Remove"
      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
      style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      <i className="fa-solid fa-xmark" style={{ fontSize: "11px" }} />
    </button>
  );
}

// ── EmptyState ─────────────────────────────────────────────────
export function EmptyState({ icon, message, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 rounded-2xl text-center"
      style={{ border: "1px dashed rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.01)" }}
    >
      <i className={`fa-solid ${icon} text-2xl mb-3`} style={{ color: "#334155" }} />
      <p className="text-slate-600 text-sm mb-3">{message}</p>
      {action}
    </div>
  );
}

// ── Raw input with dark style (used inline in tabs) ───────────
export function DarkInput({ value, onChange, placeholder, className = "", style = {} }) {
  return <StyledInput value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} style={style} />;
}

// legacy alias
export const inputCls_legacy = inputCls;
