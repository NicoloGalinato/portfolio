// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { useActiveSection } from "../../hooks";

const SECTIONS = ["home","about","skills","projects","contact"];

export default function Navbar({ data }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const active = useActiveSection(SECTIONS);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive:true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (section) => {
    const el = document.getElementById(section.toLowerCase());
    if (el) el.scrollIntoView({ behavior:"smooth" });
    setMenuOpen(false);
  };

  const navBg = {
    glass:   scrolled ? "glass bg-black/50" : "glass bg-black/20",
    solid:   "bg-slate-950 border-b border-white/10",
    minimal: "border-b border-white/5",
  }[data.style] ?? "glass bg-black/40";

  return (
    <header className="fixed top-2 left-4 right-4 z-50">
      <nav
        className={`px-5 h-14 flex items-center justify-between rounded-2xl transition-all duration-500 font-body ${navBg}`}
        style={{ boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.5)" : "none" }}
      >
      {/* Logo */}
      <button
        onClick={() => scrollTo("Home")}
        className="font-display font-extrabold text-lg grad-text-2 bg-transparent border-none cursor-pointer"
      >
        {data.logo}
      </button>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-7 list-none m-0 p-0">
        {data.links.map((link) => (
          <li key={link}>
            <button
              onClick={() => scrollTo(link)}
              className={`nav-link text-sm font-medium bg-transparent border-none cursor-pointer transition-colors duration-200
                ${active === link ? "text-violet-300 active" : "text-slate-400 hover:text-slate-200"}`}
            >
              {link}
            </button>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => scrollTo("Contact")}
          className="hidden md:block btn-grad text-white text-sm font-semibold px-5 py-2 rounded-full"
        >
          {data.ctaLabel}
        </button>
        <button
          className="md:hidden text-slate-300 text-xl bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div 
          className={`absolute top-16 left-0 right-0 rounded-2xl flex flex-col p-4 gap-2 md:hidden animate-fade-up ${navBg}`}
          style={{ boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.5)" : "none" }}
        >
          {data.links.map((link) => (
            <button key={link} onClick={() => scrollTo(link)}
              className={`text-left text-sm font-medium py-2 px-3 rounded-lg bg-transparent border-none cursor-pointer transition-all
                ${active===link ? "text-violet-300 bg-violet-400/10" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}>
              {link}
            </button>
          ))}
          <button onClick={() => scrollTo("Contact")} className="btn-grad text-white text-sm font-semibold px-5 py-2 rounded-full mt-1">
            {data.ctaLabel}
          </button>
        </div>
      )}
    </header>
  );
}
