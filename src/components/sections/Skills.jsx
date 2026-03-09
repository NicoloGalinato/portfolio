// src/components/sections/Skills.jsx
// ─────────────────────────────────────────────────────────────
// Skills section with:
//   - Responsive card grid (2 → 3 → 4 → 5 columns)
//   - Staggered scale-in animations per card
//   - Hover: lift + glow + border highlight
//   - Each card shows emoji icon, name, and category label
// ─────────────────────────────────────────────────────────────

import { Reveal, SectionHeader } from "../ui";

export default function Skills({ data }) {
  return (
    <section
      id="skills"
      className="relative z-10 px-6 py-28 max-w-7xl mx-auto"
    >
      <SectionHeader label="// skills" title={data.title} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.cards.map((card, i) => (
          <Reveal key={i} direction="scale" delay={i * 60}>
            <div className="glass skill-hover rounded-2xl p-4 text-center cursor-default">
              {card.img && card.img !== "upload" ? (
                <div className="flex justify-center mb-2">
                  <img src={card.img} alt={card.name} className="w-10 h-10 object-contain drop-shadow-md" />
                </div>
              ) : (
                <div className="text-3xl mb-2">{card.icon}</div>
              )}
              <div className="text-sm font-semibold text-slate-200 font-body">{card.name}</div>
              <div className="text-xs text-slate-500 mt-1">{card.category}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
