# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
```

> On Windows PowerShell, use `npm.cmd run build` if npm scripts fail due to execution policy.

## Stack

- **React 19 + Vite 6** — JSX (not TypeScript), SPA with client-side routing
- **React Router DOM 7** — `BrowserRouter` in `main.jsx`, routes defined in `App.jsx`
- **Tailwind CSS 4** + vanilla CSS design tokens (no utility-first usage — mostly custom CSS)
- **GSAP + ScrollTrigger** — all scroll animations and reveals
- **Lenis** — global smooth scroll (`duration: 1.2`), initialized in `App.jsx`
- **liquid-glass-react** — WebGL glass morphism, wrapped by `GlassFrame.jsx`
- **Framer Motion** — page transition states
- **Split Type** — word/character splitting for text reveal animations
- **Vidstack** — video player (Emprendimientos page)
- **Vercel Analytics + Speed Insights** — integrated in `App.jsx`

## Architecture

### Routing & Code Splitting

All pages are lazy-loaded via `React.lazy()` + `Suspense` in `App.jsx`. Routes: `/`, `/emprendimientos`, `/ceiba`, `/studio`, `/ecos` (all fallback to Home). `vercel.json` rewrites everything to `index.html` for SPA support.

### Page Structure Pattern

Every page follows: background parallax → giant hero text → subject image → overlay → content sections. GSAP animations are scoped with `gsap.context(() => { ... }, rootRef)` and reverted on cleanup with `ctx.revert()`.

### CSS Organization

- **`src/styles/base.css`** — design tokens, resets, shared UI (nav, footer, buttons, glass). Imported via `src/style.css`.
- **`src/styles/<page>.css`** — page-specific styles, imported from the page component directly.
- Do **not** consolidate page CSS back into a single file or move shared styles into page files.

### Design Tokens

All defined as CSS variables in `base.css`:
- Colors: `--bg-primary: #101511`, `--accent: #C8E632`, `--text-primary: #fff`, `--text-secondary`, `--text-muted`, `--text-faint`
- Glass: `--glass-bg`, `--glass-border`, `--glass-shadow`
- Radius: `--radius-sm` (12px) through `--radius-xl` (36px), `--radius-pill` (999px)
- Fonts: `--font-display` (Unbounded — headers), `--font-body` (Host Grotesk — body)
- Easing: `--ease-out`, `--ease-in-out`, `--ease-soft`

### Key Components

- **`Nav.jsx`** — Fixed glass nav; desktop: logo left + pill center; mobile: logo top + pill bottom. Scroll-triggered hide/show. IntersectionObserver hides on footer visibility.
- **`GlassFrame.jsx`** — Wraps `liquid-glass-react`. Uses invisible sizer + absolute glass + absolute content layering. Props: `cornerRadius`, `padding`, `displacementScale`, `blurAmount`, `saturation`, `aberrationIntensity`, `elasticity`, `mode`.
- **`BarbaTransition.jsx`** — Intercepts internal link clicks, plays GSAP overlay transition (0.62s cover → callback → 0.68s uncover). Respects `prefers-reduced-motion`.
- **`ViewportFrame.jsx`** — Fixed animated viewport border (used in Emprendimientos).

### GSAP Pattern

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // ScrollTrigger.create(), gsap.timeline(), SplitType(), etc.
  }, rootRef);
  return () => ctx.revert();
}, []);
```

Common techniques: clip-path reveals (`inset(100% 0 0 0)` → `inset(0%)`), yPercent parallax, stagger (`.stagger(0.05)`), scroll-pinned horizontal sliders.

### Responsive Breakpoints

- `max-width: 1024px` — tablet/landscape adjustments
- `max-width: 768px` — mobile/portrait (1-column grids, smaller type, nav layout change)

### Environment Variables

- `VITE_REGENERA_VIDEO_URL` — Cloudflare R2 URL for the Emprendimientos video
- `VERCEL_OIDC_TOKEN` — Vercel deployment auth (`.env.local` only)

## Things to Know Before Editing

- Changing shared class names in `base.css` can silently break GSAP selectors in page components — always search for class usage across JSX before renaming.
- `SafeLiquidGlass.jsx` exists but is not actively used (Ecos page is a placeholder).
- App.jsx clears all ScrollTriggers on route change to prevent stale triggers across pages.
- The `@` alias maps to `src/` (configured in `vite.config.js`).
