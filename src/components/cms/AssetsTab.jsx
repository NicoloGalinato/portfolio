// src/components/cms/AssetsTab.jsx
// ─────────────────────────────────────────────────────────────
// Image Assets library — upload, preview, copy URL, delete.
// Files are stored in src/assets/images via the Vite middleware.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { AddButton } from "./CMSFields";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function AssetsTab() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging,  setDragging]  = useState(false);
  const [copied,    setCopied]    = useState(null);
  const [deleting,  setDeleting]  = useState(null);
  const [preview,   setPreview]   = useState(null);  // { name, url }
  const fileRef = useRef(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res  = await fetch("/api/images");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of files) {
      if (!/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file.name)) continue;
      const fd = new FormData();
      fd.append("file", file);
      try {
        await fetch("/api/upload", { method: "POST", body: fd });
      } catch (e) {
        console.error("Upload error", e);
      }
    }
    await fetchImages();
    setUploading(false);
  };

  const deleteImage = async (name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(name);
    try {
      await fetch(`/api/images/${encodeURIComponent(name)}`, { method: "DELETE" });
      setImages((prev) => prev.filter((i) => i.name !== name));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
    setDeleting(null);
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Tab header */}
      <div className="flex items-start gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl text-xl"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(244,114,182,0.15))", border: "1px solid rgba(244,114,182,0.2)" }}
        >
          <i className="fa-solid fa-images" style={{ color: "#f472b6", fontSize: "16px" }} />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-slate-200 mb-0.5">Image Assets</h3>
          <p className="text-xs text-slate-500">Upload, manage, and copy URLs for images stored in <code className="text-violet-400 bg-white/5 px-1 rounded">src/assets/images</code>.</p>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true);  }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl transition-all mb-6"
        style={{
          border:     `2px dashed ${dragging ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.1)"}`,
          background: dragging ? "rgba(167,139,250,0.07)" : "rgba(15,10,35,0.5)",
          padding:    "2rem 1rem",
        }}
        onMouseEnter={(e) => { if (!dragging) e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; }}
        onMouseLeave={(e) => { if (!dragging) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        {uploading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#a78bfa" }} />
            <p className="text-sm text-slate-400 font-semibold">Uploading images...</p>
          </>
        ) : (
          <>
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "1.5rem", color: "#a78bfa" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300">
                {dragging ? "Drop to upload!" : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-slate-600 mt-1">PNG, JPG, SVG, WebP, GIF — saved to <strong className="text-slate-500">src/assets/images/</strong></p>
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.gif,.svg,.webp"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-600">
          <span className="text-slate-400 font-semibold">{images.length}</span> image{images.length !== 1 ? "s" : ""} stored
        </p>
        <button
          onClick={fetchImages}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
        >
          <i className="fa-solid fa-rotate-right" style={{ fontSize: "10px" }} />
          Refresh
        </button>
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: "#475569" }} />
        </div>
      ) : images.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 rounded-2xl text-center"
          style={{ border: "1px dashed rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.01)" }}
        >
          <i className="fa-solid fa-photo-film text-3xl mb-3" style={{ color: "#1e293b" }} />
          <p className="text-slate-600 text-sm mb-1">No images yet</p>
          <p className="text-slate-700 text-xs">Upload your first image above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img) => (
            <div
              key={img.name}
              className="group rounded-2xl overflow-hidden relative"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Thumbnail */}
              <div
                className="flex items-center justify-center cursor-pointer"
                style={{ height: 120, background: "rgba(15,10,35,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                onClick={() => setPreview(img)}
              >
                {img.name.endsWith(".svg") ? (
                  <img src={img.url} alt={img.name} style={{ maxHeight: 90, maxWidth: "90%", objectFit: "contain" }} />
                ) : (
                  <img src={img.url} alt={img.name} style={{ maxHeight: 90, maxWidth: "90%", objectFit: "contain" }} />
                )}
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.5)", height: 120 }}
                >
                  <i className="fa-solid fa-expand" style={{ color: "#fff", fontSize: "1.25rem" }} />
                </div>
              </div>

              {/* Info + actions */}
              <div className="p-2.5">
                <p
                  className="text-xs font-medium text-slate-300 truncate mb-0.5"
                  title={img.name}
                >
                  {img.name}
                </p>
                <p className="text-xs text-slate-700 mb-2">{formatBytes(img.size)}</p>
                <div className="flex gap-1.5">
                  {/* Copy URL */}
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg transition-all"
                    style={{
                      background: copied === img.url ? "rgba(52,211,153,0.15)" : "rgba(167,139,250,0.1)",
                      border:     copied === img.url ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(167,139,250,0.2)",
                      color:      copied === img.url ? "#34d399" : "#a78bfa",
                    }}
                  >
                    <i className={`fa-solid ${copied === img.url ? "fa-check" : "fa-copy"}`} style={{ fontSize: "10px" }} />
                    {copied === img.url ? "Copied!" : "Copy URL"}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => deleteImage(img.name)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
                    style={{ color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    disabled={deleting === img.name}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    {deleting === img.name
                      ? <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "11px" }} />
                      : <i className="fa-solid fa-trash-can" style={{ fontSize: "11px" }} />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }} />
          <div
            className="relative max-w-2xl w-full mx-4 rounded-2xl overflow-hidden"
            style={{ background: "rgba(10,6,25,0.98)", border: "1px solid rgba(167,139,250,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-sm font-semibold text-slate-200">{preview.name}</p>
                <p className="text-xs text-slate-600">{preview.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyUrl(preview.url)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: copied === preview.url ? "rgba(52,211,153,0.15)" : "rgba(167,139,250,0.1)",
                    border:     copied === preview.url ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(167,139,250,0.2)",
                    color:      copied === preview.url ? "#34d399" : "#a78bfa",
                  }}
                >
                  <i className={`fa-solid ${copied === preview.url ? "fa-check" : "fa-copy"}`} style={{ fontSize: "10px" }} />
                  {copied === preview.url ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center p-6" style={{ background: "rgba(15,10,35,0.6)", minHeight: 300 }}>
              <img src={preview.url} alt={preview.name} style={{ maxHeight: 400, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
