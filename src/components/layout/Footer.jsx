// src/components/layout/Footer.jsx
// ─────────────────────────────────────────────────────────────
// Site footer with:
//   - Three style presets: glass | minimal | gradient (from CMS)
//   - Social icon links (configurable in CMS)
//   - Copyright / custom text
//   - Reveal animation on scroll
// ─────────────────────────────────────────────────────────────

import { Reveal } from "../ui";

export default function Footer({ data }) {
  const footerCls = {
    glass:    "glass bg-black/30",
    minimal:  "border-t border-white/5",
    gradient: "bg-gradient-to-r from-violet-950/40 to-blue-950/40 border-t border-white/8",
  }[data.style] ?? "glass bg-black/30";

  return (
    <footer className={`relative z-10 ${footerCls} py-10 text-center`}>
      <Reveal direction="up" delay={0}>

        {/* Social icons */}
        <div className="flex justify-center gap-3 mb-5">
          {data.socials.map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="
                glass w-10 h-10 rounded-xl
                flex items-center justify-center
                text-slate-400 hover:text-violet-300
                border border-white/8 hover:border-violet-400/40
                transition-all duration-200 hover:-translate-y-1
                font-semibold text-sm
              "
            >
              {social.icon?.startsWith("fa-") ? <i className={social.icon} /> : social.icon}
            </a>
          ))}
        </div>

        {/* Footer text */}
        <p className="text-slate-600 text-sm font-body">{data.text}</p>

      </Reveal>
    </footer>
  );
}
