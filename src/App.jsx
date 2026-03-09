// src/App.jsx
import { useState, useEffect } from "react";
import "./styles/globals.css";

import { useCMS } from "./hooks";
import { GalaxyBg, FloatingOrbs, ShootingStars, CursorGlow, ScrollProgress } from "./components/ui/Background";
import Navbar    from "./components/layout/Navbar";
import Footer    from "./components/layout/Footer";
import Home      from "./components/sections/Home";
import About     from "./components/sections/About";
import Skills    from "./components/sections/Skills";
import Projects  from "./components/sections/Projects";
import Contact   from "./components/sections/Contact";
import AdminPage from "./components/cms/AdminPage";

// ── Themes configurations ─────────────────────────────────────
const THEMES = {
  violet: {
    "--theme-primary": "#a78bfa",
    "--theme-secondary": "#60a5fa",
    "--theme-accent": "#f472b6",
    "--theme-btn1": "#7c3aed",
    "--theme-btn2": "#2563eb",
    "--theme-bgglow": "rgba(167, 139, 250, 0.45)",
    "--bg-nebula-1": "rgba(88,28,135,0.5)",
    "--bg-nebula-2": "rgba(30,58,138,0.4)",
    "--bg-nebula-3": "rgba(157,23,77,0.2)",
  },
  emerald: {
    "--theme-primary": "#6ee7b7",
    "--theme-secondary": "#3b82f6",
    "--theme-accent": "#34d399",
    "--theme-btn1": "#059669",
    "--theme-btn2": "#2563eb",
    "--theme-bgglow": "rgba(110, 231, 183, 0.45)",
    "--bg-nebula-1": "rgba(6,95,70,0.5)",
    "--bg-nebula-2": "rgba(30,58,138,0.4)",
    "--bg-nebula-3": "rgba(5,150,105,0.2)",
  },
  rose: {
    "--theme-primary": "#fda4af",
    "--theme-secondary": "#f87171",
    "--theme-accent": "#fbbf24",
    "--theme-btn1": "#e11d48",
    "--theme-btn2": "#ea580c",
    "--theme-bgglow": "rgba(253, 164, 175, 0.45)",
    "--bg-nebula-1": "rgba(159,18,57,0.5)",
    "--bg-nebula-2": "rgba(153,27,27,0.4)",
    "--bg-nebula-3": "rgba(190,18,60,0.2)",
  },
  amber: {
    "--theme-primary": "#fcd34d",
    "--theme-secondary": "#fdba74",
    "--theme-accent": "#fb923c",
    "--theme-btn1": "#d97706",
    "--theme-btn2": "#ea580c",
    "--theme-bgglow": "rgba(252, 211, 77, 0.45)",
    "--bg-nebula-1": "rgba(146,64,14,0.5)",
    "--bg-nebula-2": "rgba(153,27,27,0.4)",
    "--bg-nebula-3": "rgba(180,83,9,0.2)",
  },
  racing_green: {
    "--theme-primary": "#86efac",
    "--theme-secondary": "#fde047",
    "--theme-accent": "#cbd5e1",
    "--theme-btn1": "#065f46",
    "--theme-btn2": "#022c22",
    "--theme-bgglow": "rgba(6, 95, 70, 0.5)",
    "--bg-nebula-1": "rgba(2,44,34,0.7)",
    "--bg-nebula-2": "rgba(6,95,70,0.5)",
    "--bg-nebula-3": "rgba(0,0,0,0.5)",
  }
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "167, 139, 250";
}

function ThemeEngine({ themeName, customColor }) {
  let vars;
  if (themeName === "custom" && customColor) {
    const rgb = hexToRgb(customColor);
    vars = {
      "--theme-primary": customColor,
      "--theme-secondary": customColor,
      "--theme-accent": customColor,
      "--theme-btn1": customColor,
      "--theme-btn2": customColor,
      "--theme-bgglow": `rgba(${rgb}, 0.45)`,
      "--bg-nebula-1": `rgba(${rgb}, 0.5)`,
      "--bg-nebula-2": `rgba(${rgb}, 0.4)`,
      "--bg-nebula-3": `rgba(${rgb}, 0.2)`
    };
  } else {
    vars = THEMES[themeName] || THEMES.violet;
  }

  const cssString = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ");

  return (
    <style suppressHydrationWarning>{`
      :root {
        ${cssString}
      }
    `}</style>
  );
}

// ── SEO Head ──────────────────────────────────────────────────
function SEOHead({ seo }) {
  useEffect(() => {
    if (!seo) return;
    document.title = seo.title || "Nico Galinato";

    const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a78bfa"/>
          <stop offset="100%" style="stop-color:#60a5fa"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="#020008"/>
      <text x="50" y="68" font-family="Arial Black,sans-serif" font-size="44" font-weight="900"
        text-anchor="middle" fill="url(#g)">NG</text>
    </svg>`;
    const faviconUrl = "data:image/svg+xml," + encodeURIComponent(svgFavicon);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = faviconUrl;

    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr === "content" ? "content" : attr, val);
    };

    setMeta('meta[name="description"]', "name", "description");
    document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description || "");
    const descEl = document.querySelector('meta[name="description"]') || document.createElement("meta");
    descEl.name = "description"; descEl.content = seo.description || ""; document.head.appendChild(descEl);

    let kwEl = document.querySelector('meta[name="keywords"]');
    if (!kwEl) { kwEl = document.createElement("meta"); kwEl.name = "keywords"; document.head.appendChild(kwEl); }
    kwEl.content = seo.keywords || "";

    const og = [
      ["og:title",       seo.title],
      ["og:description", seo.description],
      ["og:type",        "website"],
      ["og:url",         seo.siteUrl],
      ["og:image",       seo.ogImage],
      ["og:site_name",   seo.name],
    ];
    og.forEach(([prop, content]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = content || "";
    });

    const tw = [
      ["twitter:card",        "summary_large_image"],
      ["twitter:title",       seo.title],
      ["twitter:description", seo.description],
      ["twitter:site",        seo.twitterHandle],
      ["twitter:image",       seo.ogImage],
    ];
    tw.forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.content = content || "";
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = seo.siteUrl || "";

    let jsonLd = document.getElementById("portfolio-jsonld");
    if (!jsonLd) { jsonLd = document.createElement("script"); jsonLd.id = "portfolio-jsonld"; jsonLd.type = "application/ld+json"; document.head.appendChild(jsonLd); }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": seo.name,
      "url": seo.siteUrl,
      "sameAs": [],
      "jobTitle": "Full-Stack Developer",
      "description": seo.description,
    });
  }, [seo]);

  return null;
}

// ── Simple pathname-based router ──────────────────────────────
function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const fn = () => setPath(window.location.pathname);
    window.addEventListener("popstate", fn);
    return () => window.removeEventListener("popstate", fn);
  }, []);
  return path;
}

// ── Portfolio view ────────────────────────────────────────────
function Portfolio({ data }) {
  return (
    <div className="font-body text-slate-100 min-h-screen overflow-x-hidden" style={{ background: "#020008" }}>
      <SEOHead seo={data.seo} />

      <GalaxyBg />
      <FloatingOrbs />
      <ShootingStars />
      <ScrollProgress />
      <CursorGlow />

      <Navbar data={data.nav} />

      <main>
        <Home     data={data.home}     />
        <About    data={data.about}    />
        <Skills   data={data.skills}   />
        <Projects data={data.projects} />
        <Contact  data={data.contact}  />
      </main>

      <Footer data={data.footer} />
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const { data, update, reset } = useCMS();
  const path = useRoute();
  const [activeCycleTheme, setActiveCycleTheme] = useState(null);

  // ── Waterfall RGB Cycle (Every 5 mins) ──────────────────────
  useEffect(() => {
    const themeKeys = Object.keys(THEMES);
    let currentIndex = 0;

    const cycle = () => {
      currentIndex = (currentIndex + 1) % themeKeys.length;
      setActiveCycleTheme(themeKeys[currentIndex]);
    };

    // Cycle every 5 minutes (300,000 ms)
    const interval = setInterval(cycle, 300000); 
    
    // Set initial
    setActiveCycleTheme(data.theme?.color || "violet");
    
    return () => clearInterval(interval);
  }, [data.theme?.color]);

  const isAdmin = path === "/admin";
  
  // Use the cycled theme if on portfolio, or the CMS theme if in admin
  const currentTheme = isAdmin ? (data.theme?.color || "violet") : (activeCycleTheme || data.theme?.color || "violet");
  
  const themeNode = <ThemeEngine themeName={currentTheme} customColor={data.theme?.customColor || "#a78bfa"} />;

  if (isAdmin) {
    return (
      <>
        {themeNode}
        <AdminPage
          data={data}
          onUpdate={update}
          onReset={reset}
        />
      </>
    );
  }

  return (
    <>
      {themeNode}
      <Portfolio data={data} />
    </>
  );
}
