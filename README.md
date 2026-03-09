# Nico Galinato — Portfolio

> A pixel-perfect, galaxy glass-morphism portfolio with a built-in password-protected CMS, project case studies, scroll animations, and full SEO support. Built with React + Tailwind CSS.

![Portfolio Preview](https://via.placeholder.com/1200x630/020008/a78bfa?text=Nico+Galinato+Portfolio)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌌 Galaxy Background | Animated nebula, star field, shooting stars, floating orbs |
| 💎 Glass Morphism | Consistent `backdrop-blur` glass UI across all components |
| 🔡 Glitch Text | CSS chromatic-aberration glitch effect on the hero headline |
| 🎞 Scroll Animations | `IntersectionObserver`-powered `Reveal` component — staggered, directional |
| 📖 Project Case Studies | Per-project modal with overview, problem, solution, tech stack, outcome |
| ⚙ CMS Panel | Password-protected live editor accessible at `/admin` |
| 🔍 SEO | Dynamic meta tags, Open Graph, Twitter Card, JSON-LD structured data |
| 📱 Responsive | Mobile-first — works on all screen sizes |
| 🧭 Scroll Progress | Top gradient progress bar |
| 🖱 Cursor Glow | Soft violet glow follows the mouse |

---

## 🖥 System Requirements

| Tool | Version |
|---|---|
| **Node.js** | ≥ 18.0.0 |
| **npm** | ≥ 9.0.0 (comes with Node 18) |
| **Git** | any recent version |
| **Browser** | Chrome 105+, Firefox 110+, Safari 16+, Edge 105+ |

> ⚠️ **Node 18+ is required.** Vite 5 does not support Node 16 or below.

---

## 📦 Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM renderer |

### Dev / Build

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.4.10 | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.3.1 | React Fast Refresh for Vite |
| `tailwindcss` | ^3.4.14 | Utility-first CSS framework |
| `postcss` | ^8.4.47 | CSS transformer (required by Tailwind) |
| `autoprefixer` | ^10.4.20 | Adds vendor prefixes automatically |

> No runtime UI libraries. No Redux. No React Router. Pure React 18 hooks + Tailwind.

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

### 5. Preview the production build

```bash
npm run preview
```

---

## ⚙️ Configuration

### Tailwind (`tailwind.config.js`)

```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

### Fonts

Loaded via Google Fonts in `index.html` and `src/styles/globals.css`:
- **Syne** — display / headings
- **DM Sans** — body text

---

## 🔑 CMS Access

The CMS is accessible at:

```
http://localhost:5173/admin
```

Default password (change before deploying!):

```
admin1234
```

To change the password, edit `src/data/defaultData.js`:

```js
export const CMS_PASSWORD = "your-new-password";
```

> The password is stored in the source file only — **not** sent to any server. Session auth is kept in `sessionStorage` and cleared when the tab closes.

---

## 📁 File Structure

```
portfolio/
├── index.html                        ← Entry HTML, NG favicon, meta defaults
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.jsx                      ← React DOM root
    ├── App.jsx                       ← Root component, /admin routing, SEO
    │
    ├── styles/
    │   └── globals.css               ← Tailwind directives, keyframes, glass,
    │                                    glitch animation, utility classes
    ├── data/
    │   └── defaultData.js            ← All default content + CMS_PASSWORD
    │
    ├── hooks/
    │   └── index.js                  ← useCMS, useInView, useParallax,
    │                                    useScrollProgress, useActiveSection,
    │                                    useLockBodyScroll
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx            ← Fixed top nav, mobile drawer,
    │   │   │                            active section tracking
    │   │   └── Footer.jsx            ← Social links, style presets
    │   │
    │   ├── sections/
    │   │   ├── Home.jsx              ← Hero, glitch headline, parallax orb
    │   │   ├── About.jsx             ← Bio, avatar card, animated counters
    │   │   ├── Skills.jsx            ← Responsive skill card grid
    │   │   ├── Projects.jsx          ← Project cards + case study modal
    │   │   └── Contact.jsx           ← Contact form with focus glow
    │   │
    │   ├── cms/
    │   │   ├── CMSPanel.jsx          ← Password gate + slide-in drawer shell
    │   │   ├── CMSTabs.jsx           ← One tab component per section + SEO tab
    │   │   └── CMSFields.jsx         ← Field, Select, AddButton, RemoveButton
    │   │
    │   └── ui/
    │       ├── index.jsx             ← Reveal, SectionHeader, AnimatedCounter,
    │       │                            GlitchText
    │       └── Background.jsx        ← GalaxyBg, FloatingOrbs, ShootingStars,
    │                                    CursorGlow, ScrollProgress
```

---

## 🎛 CMS Sections

| Tab | What you can edit |
|---|---|
| 🧭 **Nav** | Logo, links (add/remove), CTA label, style preset |
| 🏠 **Home** | Badge, headline, role, description, CTA buttons |
| 👤 **About** | Bio paragraphs, avatar emoji, stat counters |
| 🛠 **Skills** | Skill cards — emoji, name, category (add/remove) |
| 💼 **Projects** | Project cards + full case study (overview, problem, solution, tech stack, challenges, outcome, year, role, duration) |
| 📬 **Contact** | Email, location, availability text |
| 🦶 **Footer** | Footer text, style preset, social links |
| 🔍 **SEO** | Page title, description, keywords, OG image URL, Twitter handle, site URL |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#020008` |
| Accent Violet | `#a78bfa` |
| Accent Blue | `#60a5fa` |
| Accent Pink | `#f472b6` |
| Glass BG | `rgba(255,255,255,0.04)` |
| Glass Border | `rgba(255,255,255,0.09)` |
| Display Font | Syne 700/800 |
| Body Font | DM Sans 400/500 |

---

## 🚢 Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

```bash
npm run build
```

Drag `dist/` to [netlify.com/drop](https://app.netlify.com/drop) and add a `_redirects` file in `public/`:

```
/*  /index.html  200
```

### GitHub Pages

```bash
npm install -D gh-pages
```

Add to `package.json`:

```json
"homepage": "https://yourusername.github.io/portfolio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then run:

```bash
npm run deploy
```

---

## 🔒 Security Notes

- The CMS password lives in `src/data/defaultData.js` — this is client-side only and visible in the built bundle. It is intended as a lightweight deterrent, not cryptographic security.
- For production, consider moving the password to an environment variable via Vite's `import.meta.env`:
  ```js
  export const CMS_PASSWORD = import.meta.env.VITE_CMS_PASSWORD || "admin1234";
  ```
  Then set `VITE_CMS_PASSWORD` in your hosting provider's environment variables.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built by Nico Galinato · 2025*
