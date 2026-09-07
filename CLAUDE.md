# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # next dev
npm run build     # next build
npm run start     # next start (serve the production build)

node scripts/generate-ceiba-gallery-manifest.mjs   # regenerate src/data/ceiba-gallery-manifest.json
```

There is no test runner, linter, or type-check script. `typescript` and `@types/*` are present only so Next can typecheck JSX ambiently — the codebase is plain JSX, no `.ts`/`.tsx`.

> On Windows PowerShell use `npm.cmd run build` if npm scripts fail due to execution policy.

## Stack

- **Next.js 16 App Router** + **React 19**, JSX only (`jsconfig.json` maps `@/*` → `src/*`)
- **GSAP + ScrollTrigger** — every scroll animation and reveal
- **Lenis** — global smooth scroll, single instance owned by `AppShell` and exposed as `window.naturatechLenis`
- **liquid-glass-react** — WebGL glass, always via `GlassFrame.jsx`
- **Split Type** — word/char splitting for text reveals
- **player.style** (`sutro` theme) + `@vidstack/react` — video players
- **Vercel Analytics + Speed Insights** — mounted in `AppShell`
- `tailwindcss` is in devDependencies but **not wired up** (no PostCSS/Tailwind config, no `@import "tailwindcss"`). All styling is hand-written CSS with variables. Do not reach for Tailwind classes.

## Architecture

### `app/` is thin, `views/` holds the work

`src/app/<route>/page.jsx` files are server components that do almost nothing: export a `metadata` object and render the matching `src/views/<Name>.jsx`. Every view is `'use client'` and contains the whole page. Put page logic in `src/views/`, not in `src/app/`.

Routes: `/`, `/emprendimientos`, `/ceiba`, `/studio`, `/ecos`, `/hitos`, `/links`, `/galeriaceiba`, `/privacy-policy`, `/terms-and-conditions`, plus `not-found.jsx`.

`src/app/galeriaceiba/page.jsx` is the exception — it does real server-side work (reads the R2 manifest or scans `public/assets/CEIBA/`) and passes an `images` array down.

### `AppShell.jsx` — the global client shell

`app/layout.jsx` (server) renders `<AppShell>` around `children`. AppShell owns everything global:

- The `LanguageProvider` and `SeoMetadata`
- Lenis instance wired into `gsap.ticker` and `ScrollTrigger.update`
- Boot loader teardown (see below)
- `Nav`, `Footer`, `LanguageSwitcher`, `ViewportFrame` — each conditionally hidden per route (`/links` and `/galeriaceiba` hide most chrome; `/hitos` hides the language switcher)
- On `pathname` change: scrolls Lenis to top, resets the viewport frame, and `ScrollTrigger.refresh()` after 120ms
- `<div key={pathname} className="route-view">` forces a remount of the view per route

`FrameContext.jsx` exposes `useFrameToggle()` so a view (only Emprendimientos) can show/hide the animated `ViewportFrame` border.

### Liquid glass is applied automatically, not per component

`src/lib/liquidGlass.js` is the engine: it paints an R/G displacement map from the signed distance field of an element's own rounded-rect geometry, then drives `backdrop-filter: … url(#filter)` through `feDisplacementMap` — three passes at slightly different scales for chromatic aberration. Filters are cached by geometry and reference-counted in one shared `<svg id="liquid-glass-defs">`, so a row of identically sized buttons costs one map and one filter.

`components/LiquidGlassLayer.jsx`, mounted once in AppShell, finds every `.css-glass`, `.btn-glass`, `.btn-glass-outline` and `[data-liquid-glass]` element (via `MutationObserver`, so surfaces rendered inside `.map()` are covered) and attaches the engine. **A new glass surface needs no wiring** — give it one of those classes. Tune a single surface with data attributes: `data-liquid-depth`, `-strength`, `-chromatic`, `-blur`, `-radius`, or `data-liquid-glass="off"` to opt out. Depth and strength otherwise scale off the measured box, so a 36px pill gets a proportionally thinner rim than a 300px card.

Radius comes from the element's own computed `border-radius`; blur defaults to `0` (fully clear glass — the refraction carries it). Only Chromium supports `url()` in `backdrop-filter`, so on Safari/Firefox the engine is inert and the `.css-glass` / `--glass-strong-filter` styling stays as the fallback. `chromatic: 0` collapses it to a single displacement pass if it ever costs too much.

### Bilingual content (ES/EN) lives in `src/translations/index.js`

`LanguageContext` provides `{ lang, switchLanguage, t }` where `t = translations[lang]`. **All user-facing copy belongs in `translations/index.js`**, keyed by page (`common`, `nav`, `footer`, `home`, `ceiba`, …), never hardcoded in a view. Language persists in both `localStorage` and the `nt-lang` cookie; `switchLanguage` plays a GSAP wipe overlay unless `prefers-reduced-motion`.

Some translation values are **word-token arrays** for per-word animated headings: each entry is `'text'`, `['text', 'cssClass']`, `'BR'` (line break), or `'ICON'` (view-supplied inline SVG). See the mission heading in `views/Home.jsx` for the render pattern.

### SEO is split in two, deliberately

- **Static, Spanish, server-rendered**: `metadata` exports in `app/layout.jsx` and each `page.jsx`; `app/sitemap.js`.
- **Language-reactive, client-side**: `components/SeoMetadata.jsx` rewrites `document.title` and the description/OG/Twitter meta tags from `src/data/seoMetadata.js` whenever `lang` or `pathname` changes.

When adding a route, update both: a `metadata` export on the page, an entry in `data/seoMetadata.js`, and (if public) `app/sitemap.js`.

### Navigation does a full page load, on purpose

`Nav.jsx` intercepts clicks, plays a GSAP animation that flies the active icon to the destination link, then navigates with `window.location.href` (not `next/link`, not the router). This is intentional — it guarantees a clean GSAP/ScrollTrigger slate per page. `app/layout.jsx`'s inline boot-loader script hardcodes the same route list; keep it in sync with `NAV_ROUTES`.

### Boot loader

An inline `<script>` in `layout.jsx` reads `localStorage['naturatech-boot-loader-seen']` before paint and adds `html.boot-loader-seen` to suppress the `#boot-loader` element on repeat visits. AppShell removes the node after a 500ms + 1200ms fade on first visit. Both halves must agree, and the route list in that script gates whether the loader shows at all.

### `src/proxy.js` (Next 16 middleware)

Matched on `/500`, `/en` only. `/en` sets the `nt-lang=en` cookie and 307s to `/`; requests to the `naturatech.org` apex/www host 308 to `500.naturatech.org`.

### GSAP pattern

Every view scopes its animations and cleans up:

```jsx
useEffect(() => {
  if (!rootRef.current) return;
  const ctx = gsap.context(() => {
    /* ScrollTrigger.create(), timelines, SplitType(), … */
  }, rootRef);
  return () => {
    ctx.revert();
    cleanupGsapRoute(rootRef.current);
  };
}, []);
```

`utils/cleanupGsapRoute.js` kills only the ScrollTriggers whose `trigger`/`pin` element is inside the given root, plus tweens on its subtree — it is deliberately scoped so it can't clobber the shell's own triggers. Views that animate on `t` must re-run their effect on language change.

Common techniques: clip-path reveals (`inset(100% 0 0 0)` → `inset(0%)`), `yPercent` parallax, `.stagger()`, scroll-pinned horizontal sliders.

### CSS organization

- **`src/styles/base.css`** — design tokens, reset, boot loader, nav, footer, buttons, shared glass, language overlay.
- **`src/styles/<page>.css`** — page-specific styles.
- **All of them are imported by `app/layout.jsx`**, not by the views. A new page's CSS must be added to that import list, or it won't load. (This is a change from the old Vite setup — do not import CSS from a view.)
- Do not consolidate page CSS back into one file or move shared rules into page files.

### Design tokens (`base.css` `:root`)

- Colors: `--bg-primary: #101511`, `--bg-card`, `--accent: #C8E632` (+ `--accent-soft/-dark/-glow/-olive`), `--text-primary`, `--text-secondary`, `--text-muted`, `--text-faint`
- Glass: `--glass-bg`, `--glass-bg-strong`, `--glass-border`, `--glass-edge`, `--glass-shadow`, and the `--glass-strong-*` set
- Radius: `--radius-sm` (12px) → `--radius-xl` (36px), `--radius-pill` (999px)
- Fonts: `--font-display` (Unbounded — headings), `--font-body` (Host Grotesk)
- Easing: `--ease-out`, `--ease-in-out`, `--ease-soft`

### Key components

- **`GlassFrame.jsx`** — the only correct way to use `liquid-glass-react`. LiquidGlass renders four full-size siblings that destroy layout, so GlassFrame layers an invisible `inert` sizer (layout footprint) + absolute glass (visual, click-through) + absolute real content. Props: `cornerRadius`, `padding`, `displacementScale`, `blurAmount`, `saturation`, `aberrationIntensity`, `elasticity`, `mode`.
- **`Nav.jsx`** — CSS glass morphism + liquid glass, *not* GlassFrame (the `liquid-glass-react` component broke layout here; don't reintroduce it). Desktop: circular logo left + centered pill. Mobile: logo top-center + bottom pill. Hides on scroll-down and when the footer intersects.
- **`SafeLiquidGlass.jsx`** and **`WaterRipple.jsx`** exist but are not imported anywhere.

### Responsive breakpoints

`max-width: 1024px` (tablet/landscape) and `max-width: 768px` (mobile — 1-column grids, smaller type, nav layout swap).

### Environment variables

See `.env.example`; secrets live in `.env.local` (gitignored).

- `NEXT_PUBLIC_REGENERA_VIDEO_URL` — R2 URL for the Emprendimientos video (has a hardcoded fallback)
- `CEIBA_GALLERY_BASE_URL` — server-only R2 base for the CEIBA gallery. When set, the gallery is built from `src/data/ceiba-gallery-manifest.json`; when unset it scans `public/assets/CEIBA/galería CEIBA 2025/` and falls back to four placeholder webps.
- `CEIBA_GALLERY_USE_CLOUDFLARE_RESIZING` — `'true'` routes gallery images through `/cdn-cgi/image/`

## Things to Know Before Editing

- Liquid-glass surfaces are fragile to their ancestors: an `opacity` below 1, or any `filter`, on the element or an ancestor makes it a backdrop root and the refraction (and blur) silently vanish. GSAP tweens that touch `filter` on a glass surface should `clearProps: 'filter'` — `LanguageSwitcher.jsx` does.
- Changing a shared class name in `base.css` can silently break GSAP selectors in views — grep for the class across `src/views/` and `src/components/` before renaming.
- Gallery source images are gitignored (`public/assets/CEIBA/galería CEIBA 2025/`, `*.mp4`). The committed manifest is the source of truth in production; rerun the generator script if the local folder changes.
- `NATURADESIGN.md` is a longer Spanish design/architecture guide. Its "Estado vigente" section still holds for design decisions, but its file-layout sections describe the pre-Next.js Vite structure (`src/pages/`, `App.jsx`, `main.jsx`, `vite.config.js`) and are stale.
- Stale build artifacts from the old Vite setup (`dist/`) and many `*.log` files sit in the repo root; ignore them.
