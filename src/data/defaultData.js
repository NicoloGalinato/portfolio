// src/data/defaultData.js

export const DEFAULT_DATA = {
  seo: {
    name: "Nico Galinato",
    title: "Nico Galinato — Full-Stack Developer",
    description:
      "Full-Stack Developer based in Metro Manila, Philippines. I build immersive digital experiences — from pixel-perfect UIs to scalable back-end systems.",
    keywords:
      "Nico Galinato, Full-Stack Developer, React, Node.js, Web Developer, Philippines, Portfolio",
    ogImage: "",
    twitterHandle: "@nicogalinato",
    siteUrl: "https://nicogalinato.dev",
  },

  nav: {
    logo: "Nico Galinato",
    links: ["Home", "About", "Skills", "Projects", "Contact"],
    ctaLabel: "Hire Me",
    style: "glass",
  },

  theme: {
    color: "violet", // Let's use string keys for presets
  },

  home: {
    badge: "✦ Available for work",
    headline: "Hi! I'm Nico Galinato",
    role: "Full-Stack Developer",
    description:
      "I craft immersive digital experiences — from pixel-perfect UIs to scalable back-end systems. Turning complex ideas into elegant, performant products.",
    cta1: "View Projects",
    cta2: "Let's Talk",
    resumeUrl: "", // Added URL field for CV/Resume
  },

  about: {
    title: "A bit about myself",
    bio1: "I'm a passionate Full-Stack Developer with 4+ years of experience building web and mobile applications. I love blending design sensibility with engineering rigor to deliver products users genuinely enjoy.",
    bio2: "When I'm not coding, you'll find me stargazing, exploring generative art, or mentoring junior devs in my community.",
    stats: [
      { num: "4+",  label: "Years Exp." },
      { num: "30+", label: "Projects"   },
      { num: "12+", label: "Clients"    },
    ],
    avatarEmoji: "👨‍💻",
  },

  skills: {
    title: "My Toolkit",
    cards: [
      { icon: "⚛️", name: "React",        category: "Frontend"        },
      { icon: "🟦", name: "TypeScript",   category: "Language"        },
      { icon: "🌿", name: "Node.js",      category: "Backend"         },
      { icon: "🐘", name: "PostgreSQL",   category: "Database"        },
      { icon: "🐳", name: "Docker",       category: "DevOps"          },
      { icon: "🎨", name: "Tailwind CSS", category: "Styling"         },
      { icon: "🔥", name: "Firebase",     category: "Cloud"           },
      { icon: "🐙", name: "Git / GitHub", category: "Version Control" },
      { icon: "🤖", name: "Python",       category: "Language"        },
      { icon: "📱", name: "React Native", category: "Mobile"          },
    ],
  },

  projects: {
    title: "Featured Work",
    items: [
      {
        id: 1,
        emoji: "🌌",
        title: "GalaxyChat App",
        description: "Real-time messaging platform with end-to-end encryption, custom themes, and 10k+ active users.",
        tags: ["React", "Node", "MongoDB"],
        demo: "#",
        github: "#",
        caseStudy: {
          overview: "GalaxyChat was born out of a need for a privacy-first messaging platform that doesn't compromise on design.",
          problem: "Existing chat apps either prioritised security at the expense of UX, or offered great design without meaningful privacy guarantees.",
          solution: "Built a WebSocket-powered real-time engine with end-to-end encryption on the client side using the Web Crypto API.",
          techStack: [
            { label: "Frontend",  value: "React 18, Zustand, Tailwind CSS"  },
            { label: "Backend",   value: "Node.js, Express, Socket.IO"       },
            { label: "Database",  value: "MongoDB Atlas, Redis (sessions)"   },
            { label: "Auth",      value: "JWT + refresh tokens"              },
            { label: "Hosting",   value: "Vercel (FE) + Railway (BE)"        },
          ],
          challenges: "The hardest part was implementing real-time read receipts at scale without hammering the database. Solved with Redis pub/sub for in-flight events.",
          outcome: "Launched to 10k+ users in the first month. Average session time is 18 minutes — 3x the industry average.",
          duration: "3 months",
          role: "Solo Developer",
          year: "2024",
        },
      },
      {
        id: 2,
        emoji: "📊",
        title: "FinTrack Dashboard",
        description: "Personal finance tracker with AI-powered insights, beautiful charts, and multi-currency support.",
        tags: ["Next.js", "TypeScript", "Postgres"],
        demo: "#",
        github: "#",
        caseStudy: {
          overview: "FinTrack started as a personal side project — I was frustrated with bloated finance apps and wanted something minimal, fast, and smart.",
          problem: "Most finance trackers are overwhelming. Too many features, too many categories, and zero actionable insights.",
          solution: "Designed a clean dashboard with a 3-metric focus: net worth, monthly delta, and savings rate. Integrated GPT-4 to surface one weekly insight in plain English.",
          techStack: [
            { label: "Frontend",  value: "Next.js 14, TypeScript, Recharts"   },
            { label: "Backend",   value: "Next.js API routes, Prisma ORM"     },
            { label: "Database",  value: "PostgreSQL (Supabase)"              },
            { label: "AI",        value: "OpenAI GPT-4 via API"               },
            { label: "Auth",      value: "NextAuth.js (Google + GitHub)"      },
          ],
          challenges: "Multi-currency real-time conversion without paid APIs. Solved by caching ECB rates hourly and computing conversions client-side.",
          outcome: "Used daily by 200+ beta users. Average user reduces unnecessary subscriptions by 3,500/month after 30 days.",
          duration: "6 weeks",
          role: "Solo Developer",
          year: "2024",
        },
      },
      {
        id: 3,
        emoji: "🛍️",
        title: "ShopVerse E-commerce",
        description: "Full-featured e-commerce platform with inventory management, analytics, and Stripe integration.",
        tags: ["Vue", "Laravel", "Redis"],
        demo: "#",
        github: "#",
        caseStudy: {
          overview: "ShopVerse was commissioned by a local retailer looking to migrate from a legacy system to a modern, self-hosted platform they could actually own.",
          problem: "The client was paying high SaaS fees and had zero control over their data or checkout flow.",
          solution: "Built a Vue 3 + Laravel API stack with a custom admin panel, Stripe Checkout integration, and a Redis-backed inventory reservation system.",
          techStack: [
            { label: "Frontend",  value: "Vue 3, Pinia, Vite"                },
            { label: "Backend",   value: "Laravel 11, PHP 8.3"               },
            { label: "Database",  value: "MySQL + Redis (cache and queues)"  },
            { label: "Payments",  value: "Stripe Checkout + Webhooks"        },
            { label: "Hosting",   value: "DigitalOcean Droplet + Forge"      },
          ],
          challenges: "Inventory reservation race conditions under flash sale load. Solved with Redis atomic DECR commands and a queue-based order confirmation flow.",
          outcome: "Reduced checkout abandonment by 40%. Client saved 85k/year vs previous SaaS plan. Handles 500+ daily orders during peak season.",
          duration: "4 months",
          role: "Lead Developer",
          year: "2023",
        },
      },
    ],
  },

  contact: {
    title: "Let's Work Together",
    email: "nico@nicogalinato.dev",
    location: "Metro Manila, Philippines",
    availability: "Open to freelance & full-time",
  },

  footer: {
    text: "© 2025 Nico Galinato · Crafted with ✦ & React",
    socials: [
      { icon: "𝕏",  url: "#" },
      { icon: "in", url: "#" },
      { icon: "⌥",  url: "#" },
    ],
    style: "glass",
  },
};

// Change this before deploying!
export const CMS_PASSWORD = "admin1234";
