// src/components/sections/Contact.jsx
// ─────────────────────────────────────────────────────────────
// Contact section with:
//   - Info card (email, location, availability) with icon tiles
//   - Decorative dot-grid pattern
//   - Contact form with glowing focus states
//   - "Sent!" success state with animation
//   - Left / right Reveal slide-in animations
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Reveal, SectionHeader } from "../ui";

export default function Contact({ data }) {
  const [form,  setForm]  = useState({ name: "", email: "", message: "" });
  const [sent,  setSent]  = useState(false);
  const [focus, setFocus] = useState("");

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4500);
  };

  const inputCls = (field) => `
    form-input w-full px-4 py-3 rounded-xl bg-black/30 border text-white
    text-sm outline-none transition-all duration-200 font-body
    border-white/8 hover:border-white/15
  `;

  const infoItems = [
    { icon: "📧", text: data.email       },
    { icon: "📍", text: data.location    },
    { icon: "💼", text: data.availability },
  ];

  const formFields = [
    { field: "name",    label: "Name",    placeholder: "Your name",                   type: "input"    },
    { field: "email",   label: "Email",   placeholder: "you@email.com",               type: "input"    },
    { field: "message", label: "Message", placeholder: "Tell me about your project…", type: "textarea" },
  ];

  return (
    <section
      id="contact"
      className="relative z-10 px-6 py-28 max-w-7xl mx-auto"
    >
      <SectionHeader label="// contact" title={data.title} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Info card */}
        <Reveal direction="left" delay={100}>
          <div className="glass rounded-2xl p-6 h-full">
            <h3 className="font-display font-bold text-xl mb-6">Get in touch</h3>

            {infoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/15 flex items-center justify-center text-base flex-shrink-0 transition-all duration-200 group-hover:bg-violet-400/20 group-hover:border-violet-400/30">
                  {item.icon}
                </div>
                <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                  {item.text}
                </span>
              </div>
            ))}

            {/* Decorative dot grid */}
            <div
              className="mt-8 opacity-20"
              style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: "6px" }}
            >
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    background: i % 3 === 0
                      ? "rgba(167,139,250,0.5)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Form card */}
        <Reveal direction="right" delay={200}>
          <div className="glass rounded-2xl p-6">
            {sent ? (
              /* Success state */
              <div
                className="h-full min-h-[280px] flex flex-col items-center justify-center text-center gap-3 animate-fade-up"
              >
                <div className="text-5xl mb-2">🚀</div>
                <p className="font-display font-bold text-xl grad-text-2">Message Sent!</p>
                <p className="text-slate-500 text-sm">I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                {formFields.map(({ field, label, placeholder, type }) => (
                  <div className="mb-4" key={field}>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">
                      {label}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        className={`${inputCls(field)} resize-none min-h-[110px]`}
                        placeholder={placeholder}
                        value={form[field]}
                        onFocus={() => setFocus(field)}
                        onBlur={() => setFocus("")}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      />
                    ) : (
                      <input
                        className={inputCls(field)}
                        placeholder={placeholder}
                        value={form[field]}
                        onFocus={() => setFocus(field)}
                        onBlur={() => setFocus("")}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  className="btn-grad w-full text-white font-semibold py-3 rounded-full text-sm"
                >
                  Send Message ✦
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
