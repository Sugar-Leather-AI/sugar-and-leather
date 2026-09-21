# Tech Stack

Documentation of the technologies used to build and run the Sugar & Leather website.

## Overview

| Layer | Choice |
| --- | --- |
| UI library | [React](https://react.dev/) 19 |
| Routing | [React Router](https://reactrouter.com/) 7 |
| Build tool | [Vite](https://vite.dev/) 6 |
| Language | JavaScript / JSX (TypeScript used for tooling & type checks) |
| Icons | [Lucide React](https://lucide.dev/) |
| Styling | Custom CSS (`src/styles/`) |
| Hosting | [Vercel](https://vercel.com/) |
| Runtime | Node.js 24 (`engines`: `>=24 <25`) |
| Package manager | npm |

**Production URL (Vercel):** https://sugar-and-leather.vercel.app  
**Repository:** https://github.com/Sugar-Leather-AI/sugar-and-leather

---

## Application

- **Entry:** `index.html` → `src/main.jsx` → `src/App.jsx`
- **Pages:** React components under `src/pages/`
- **Shared UI:** `src/components/`
- **Content / copy:** `src/data/`
- **Hooks & helpers:** `src/hooks/`, `src/lib/`
- **Client-side routing:** React Router with SPA fallback on Vercel (`vercel.json` rewrites)

---

## Tooling

| Concern | Tool |
| --- | --- |
| Dev server | `npm run dev` (Vite) |
| Production build | `npm run build` (SEO check → Vite build → SEO build) |
| Lint | ESLint 9 (flat config) + React / Hooks plugins |
| Type checks | TypeScript + baseline script (`npm run typecheck`) |
| Unit / component tests | Vitest + Testing Library + jsdom |
| Full gate | `npm run verify` (lint → typecheck → test → build) |

SEO helpers live in `scripts/seo-check.mjs` and `scripts/seo-build.mjs` (route metadata validation and prerender support).

---

## Hosting & deploy

- **Primary:** Vercel (Vite framework preset, output `dist/`)
- **Config:** `vercel.json` — build command, output directory, SPA rewrites
- **Node on Vercel:** 24.x
- **GitHub Actions:** none right now — no CI verify job and no Docker/VM deploy workflow. Deploys are handled by Vercel.

---

## Optional / supporting pieces

| Piece | Role |
| --- | --- |
| `server/feedback/` | Optional Node feedback API (legacy; not required for the static site) |
| `Dockerfile` / `deploy/` / `netlify.toml` | Legacy artifacts from the previous Docker/VM hosting path; not used for current Vercel hosting |

---

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:5173/

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run verify   # lint + typecheck + test + build
```

Requires **Node.js 24** (see `.nvmrc`).
