# migration.md — Handoff for migrating this project to Next.js (App Router) + shadcn/ui

> **Purpose:** This document is a complete, code-grounded inventory of the current
> application so that a *separate* agent can migrate it 1:1 to **Next.js (App Router)**
> with **shadcn/ui** and **Tailwind CSS**, without guessing.
>
> **Scope rule:** This file is documentation only. Do not treat any code block here as a
> command to change the existing app. The migration itself must be done in a new
> project/branch, not by editing this app in place.
>
> **Snapshot:** Branch `new-ui-impl`, HEAD `e49d98b` ("Merge pull request #13 from
> auriorajaa/improve-arcade-games"). Working tree has uncommitted modifications to the
> 9 arcade games + `ArcadePreview.jsx` + `index.css` + `pages/Arcade.jsx`, and untracked
> files `HandAssets.jsx`, `arcadeService.js`, `arcadeService.test.js`, `geminiService.js`,
> `shopService.js`. This document reflects the current (working-tree) state.
>
> **Legend:** `UNCLEAR — needs verification` marks anything not confirmable from source.
> `MISSING — not present in current project` marks things that do not exist.

---

## Table of contents (24 sections)

1. [Project metadata](#1-project-metadata)
2. [Application overview](#2-application-overview)
3. [Dependencies & versions](#3-dependencies--versions)
4. [Directory structure](#4-directory-structure)
5. [Entry point & build](#5-entry-point--build)
6. [Routing](#6-routing)
7. [Pages](#7-pages)
8. [Components inventory](#8-components-inventory)
9. [Styling & theme](#9-styling--theme)
10. [State management & contexts](#10-state-management--contexts)
11. [Data layer, services & APIs](#11-data-layer-services--apis)
12. [Assets](#12-assets)
13. [Arcade games subsystem](#13-arcade-games-subsystem)
14. [Persistence & localStorage keys](#14-persistence--localstorage-keys)
15. [Environment variables & configuration](#15-environment-variables--configuration)
16. [Error handling & resilience](#16-error-handling--resilience)
17. [Accessibility](#17-accessibility)
18. [Testing](#18-testing)
19. [Chakra UI → shadcn/ui migration map](#19-chakra-ui--shadcnui-migration-map)
20. [Constraints, gotchas & SSR hazards](#20-constraints-gotchas--ssr-hazards)
21. [Do-not-change files / values](#21-do-not-change-files--values)
22. [Verification checklist](#22-verification-checklist)
23. [Risks & open questions](#23-risks--open-questions)
24. [Appendix: exact token & constant reference](#24-appendix-exact-token--constant-reference)

---

## 1. Project metadata

| Field | Value |
|---|---|
| `package.json` name | `frontend` |
| Version | `0.1.0` |
| Private | `true` |
| Product / brand | **Aurio Rajaa** software-engineer portfolio |
| Production domain | `https://aurio.work` |
| Author | Aurio Rajaa (full name: Aurio Hendrianoko Rajaa) |
| Contact email | `mr.auriorajaa@gmail.com` |
| Repo file root | `D:\WebProject\portfolio\frontend` |
| Git branch | `new-ui-impl` |
| Node (local) | `v22.22.3` |
| Package manager | npm (`package-lock.json` present; no yarn/pnpm lockfile) |
| Node engine pin | **MISSING — not present** (no `.nvmrc`, no `engines`, no `.tool-versions`) |
| License | **MISSING — not present** in package.json |

The package name `frontend` is generic; the actual application is the "Aurio Rajaa"
portfolio. Do not rename the product based on `package.json`.

---

## 2. Application overview

A single-page React portfolio plus an admin CMS and a retro browser arcade/games area.
It is a **Create React App (CRA)** SPA (`react-scripts@5.0.1`), styled entirely with
**Chakra UI v2** (custom theme, light/dark), routed with **react-router-dom v7**
(v6-style API), persisted with **Firebase Realtime Database + Firebase Auth**, and
deployable to **Vercel** (static build + one serverless function).

Public surface:
- Marketing portfolio at `/` (Hero, About, Experience, Projects, Skills, Education,
  Gallery, Articles, Playground preview, Arcade preview, Contact).
- Article reader `/article/:slug` (Firebase-backed).
- Project case study `/project/:slug`.
- Local browser tools `/playground` (JSON/Text/URL/Base64/Date/Color + Trivia + Movies).
- 9-game retro arcade `/arcade` with coins, shop, skins, power-ups, Web-Audio BGM,
  achievements, stats and a CRT mode.
- Admin CMS at `/dashboard-secure-panel` (gated to a single admin email).
- 404/503 page.

Architecture summary: a thin client that reads/writes Firebase RTDB directly from the
browser. There is **no custom backend** except `api/article.js`, a Vercel serverless
function that server-renders SEO meta tags for article URLs.

---

## 3. Dependencies & versions

### 3.1 Runtime dependencies (from `package.json`)

| Package | Range | Purpose |
|---|---|---|
| `@chakra-ui/icons` | `^2.2.4` | Icon set (`AddIcon`, `EditIcon`, `DeleteIcon`, `ArrowUpIcon`, `ArrowDownIcon`, `ExternalLinkIcon`) |
| `@chakra-ui/react` | `^2.8.2` | Component library / theming |
| `@emailjs/browser` | `^4.4.1` | Contact form email sending |
| `@emotion/react` | `^11.14.0` | Chakra peer dependency |
| `@emotion/styled` | `^11.14.0` | Chakra peer dependency |
| `@gsap/react` | `^2.1.2` | `useGSAP` hook |
| `gsap` | `^3.15.0` | Animations (`ScrollTrigger`, `Flip`, `MotionPathPlugin`, `ScrollToPlugin`, `TextPlugin`) |
| `lucide-react` | `^0.475.0` | Icon set used throughout |
| `react` | `^18.2.0` | UI |
| `react-dom` | `^18.2.0` | DOM renderer |
| `react-copy-to-clipboard` | `^5.1.0` | Copy helper (dependency; usage UNCLEAR — needs verification) |
| `react-helmet-async` | `^2.0.5` | Document head management (SEO) |
| `react-icons` | `^5.4.0` | Icon set (dependency; usage UNCLEAR — needs verification) |
| `react-intersection-observer` | `^10.0.0` | Used by `src/hooks/useGsapReveal.js` |
| `react-lazy-load-image-component` | `^1.6.3` | Lazy images + `opacity` effect CSS |
| `react-loader-spinner` | `^8.0.0` | Spinner (dependency; usage UNCLEAR — needs verification) |
| `react-quill` | `^2.0.0` | Rich-text article editor (admin) |
| `react-router-dom` | `^7.13.0` | Routing (v6 API in code) |
| `react-share` | `^5.2.2` | Share buttons (admin article list) |
| `react-tsparticles` | `^2.12.2` | Dependency; usage UNCLEAR — needs verification |
| `react-typed` | `^2.0.12` | Dependency; usage UNCLEAR — needs verification |
| `web-vitals` | `^2.1.4` | `reportWebVitals` |
| `@vercel/analytics` | `^2.0.1` | `<Analytics />` in `App.js` |
| `firebase` | `^12.9.0` | Auth + RTDB + Storage |
| **Testing (shipped as deps)** | | `@testing-library/dom ^10.4.0`, `@testing-library/jest-dom ^6.6.3`, `@testing-library/react ^16.2.0`, `@testing-library/user-event ^13.5.0` |

### 3.2 Dev tooling
- `react-scripts` `5.0.1` (react-app / react-app/jest ESLint configs).
- No separate TypeScript, ESLint config file, Prettier, Tailwind, or Husky config.

### 3.3 Browserslist
```
production: [">0.2%", "not dead", "not op_mini all"]
development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
```

### 3.4 npm scripts
```
start   → react-scripts start
build   → react-scripts build
test    → react-scripts test
eject   → react-scripts eject
```

**Next.js mapping:** replace the whole build system. New deps will be `next`, `react`,
`react-dom`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `class-variance-authority`,
`clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/*` (via shadcn CLI), `sonner`,
`next-themes`, `firebase`, `gsap`/`@gsap/react`. `react-helmet-async` is replaced by the
Metadata API; `react-lazy-load-image-component` by `next/image`; `react-router-dom` by
App Router. `react-quill` should be replaced by a client-only rich editor (or dynamically
imported) — it is not SSR-safe.

---

## 4. Directory structure

```
frontend/
├── api/
│   └── article.js                # Vercel serverless fn: SSR meta for /article/:slug
├── build/                        # CRA production build (deploy output; do not port)
├── public/
│   ├── index.html                # CRA HTML shell, SEO + JSON-LD + font preload
│   ├── manifest.json             # PWA manifest
│   ├── favicon*.png, apple-touch-icon.png, portfolio.png, profilepic.png
│   ├── CV_AurioRajaa.pdf         # CV download target
│   ├── robots.txt, sitemap.xml   # (present in public)
│   └── sertif-*.png/.jpeg, EXPECTIK-*.png, OP-2024.png   # certificate/activity images
├── src/
│   ├── App.js                    # Router + providers + routes
│   ├── App.css                   # (legacy; effectively unused)
│   ├── App.test.js               # Theme smoke test
│   ├── index.js                  # ReactDOM root + providers
│   ├── index.css                 # `.spin` keyframes only
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── components/
│   │   ├── admin/                # 15 admin managers/forms (see §8)
│   │   ├── arcade/               # 9 games + HandAssets + canvasUtils
│   │   ├── auth/ProtectedRoute.jsx
│   │   ├── layout/               # Header, Layout, Sidebar (Sidebar is dead code)
│   │   ├── playground/           # MovieFinder, TriviaArena
│   │   ├── public/studio.js      # useStudioColors, StudioPill, StudioSection, SplitWords
│   │   ├── sections/             # 14 portfolio sections
│   │   └── ui/                   # SectionTitle, retro.js, modals, Pagination, ImageUpload, Divider, ArrayInput
│   ├── config/firebase.js        # Firebase app/auth/db/storage init
│   ├── contexts/                 # AuthContext.js, PortfolioContext.js
│   ├── data/portfolioData.js     # Default portfolio content + skillsData
│   ├── hooks/                    # useForm, useGsapReveal, useThemeToggle
│   ├── pages/                    # 8 pages
│   ├── services/                 # 10+ service modules
│   ├── styles/theme.js           # Chakra theme
│   └── utils/                    # gsap, seo, slugify, projectMedia
├── .env                          # Committed env file (client-exposed keys)
├── package.json
├── vercel.json                   # rewrites + cache headers
└── README.md
```

`src/App.css` and `src/setupTests.js` exist; `App.css` is imported by neither `App.js`
nor `index.js` (legacy CRA artifact). `src/components/layout/Sidebar.jsx` is **orphaned**
(no importer anywhere in `src`).

---

## 5. Entry point & build

### 5.1 `src/index.js` (verbatim, 19 lines)
```js
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import "react-lazy-load-image-component/src/effects/opacity.css";
import App from "./App";
import theme from "./styles/theme";
import "./utils/gsap";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ChakraProvider theme={theme} resetCSS>
        <App />
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>
);
```
Provider nesting (must be preserved in `app/layout.tsx` as client providers):
`React.StrictMode > HelmetProvider > ChakraProvider(theme, resetCSS) > App`.

Import-order side effect: `./utils/gsap` runs module-level GSAP plugin registration.
`opacity.css` is a global CSS side effect for `react-lazy-load-image-component`.

### 5.2 `src/App.js` (126 lines)
- `BrowserRouter` → `AuthProvider` → `PortfolioProvider` → `Box` (`Routes`, `<Analytics />`).
- Local `isDownloading` state and `handleDownload` (App.js:23–44) are threaded to every
  page as props; they are removed in App Router, but the CV download behavior must be
  preserved. `handleDownload` uses `document.createElement("a")`,
  `window.location.origin`, `document.body.appendChild/removeChild`, and `setTimeout`.
- Route table (App.js:52–116):

| Path | Element | Notes |
|---|---|---|
| `/` | `Home` | receives `isDownloading`, `handleDownload` |
| `/login` | `Login` | no props |
| `/article/:slug` | `ArticlePage` | receives download props |
| `/project/:slug` | `ProjectPage` | receives download props |
| `/playground` | `Playground` | receives download props |
| `/arcade` | `Arcade` | receives download props |
| `/dashboard-secure-panel` | `<ProtectedRoute><AdminDashboard/></ProtectedRoute>` | **only protected route** |
| `/503` | `NotFound` with `code="503"` etc. | |
| `*` | `NotFound` | 404 |

### 5.3 `public/index.html` shell
Contains: lang `en`, `prefix="og: https://ogp.me/ns#"`, theme-color `#1e1e1e`, full SEO
metadata, canonical `https://aurio.work/`, PWA manifest link, favicon/apple icons,
`<link rel="preload" as="image" href="/profilepic.png">`, Google Fonts Plus Jakarta Sans
(`400;500;600;700`, `display=swap`), geo meta, OpenGraph, Twitter card, `format-detection`,
and **two JSON-LD blocks** (Person + WebSite). Body has `<noscript>` text and `<div id="root">`.

**Next.js mapping:** move head tags to `app/layout.tsx` `metadata`/`viewport` exports or
`generateMetadata`, and JSON-LD via `<script type="application/ld+json" dangerouslySetInnerHTML>`
in the layout. Fonts → `next/font/google`. `manifest.json` → `app/manifest.ts` or keep in
`public/`.

### 5.4 `vercel.json`
```json
{
  "rewrites": [
    { "source": "/article/:slug", "destination": "/api/article?slug=:slug" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/(.*)\\.(png|jpg|jpeg|gif|webp)$",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```
In Next.js the SPA fallback is unnecessary; the `/article/:slug` rewrite is superseded by
App Router `generateMetadata`, but the cache header is still valuable (or use `next.config`
`headers()` + `next/image` optimization).

---

## 6. Routing

Current: `react-router-dom` v7 with the **v6 declarative API**. Router components in use:
`BrowserRouter`, `Routes`, `Route`, `Link`, `Navigate`, `useNavigate`, `useParams`,
`useLocation`.

Routes and required migration target:

| React Router route | Next.js App Router target |
|---|---|
| `/` | `app/page.tsx` |
| `/login` | `app/login/page.tsx` |
| `/article/:slug` | `app/article/[slug]/page.tsx` (+ `generateMetadata`) |
| `/project/:slug` | `app/project/[slug]/page.tsx` |
| `/playground` | `app/playground/page.tsx` |
| `/arcade` | `app/arcade/page.tsx` |
| `/dashboard-secure-panel` | `app/dashboard-secure-panel/page.tsx` + auth guard (middleware or client guard) |
| `/503` | `app/503/page.tsx` |
| `*` | `app/not-found.tsx` |

Navigation call sites:
- `useNavigate`: `Login` (`/`, `/dashboard-secure-panel`), `AdminDashboard` (`/`, `/login`),
  `ArticlePage` (`/article/:slug`, `/` with `{ state: { scrollTo: "articles" } }`),
  `ProjectPage` (`/`, `/` with `{ state: { scrollTo: "projects" } }`), `Articles` section
  (`/article/${slug}`).
- Scroll handoff: `Home.jsx:42–51` reads `location.state?.scrollTo`, calls
  `document.getElementById(...).scrollIntoView`, then `window.history.replaceState({}, document.title)`
  to clear the state. **This route-state handoff must be reimplemented** in App Router
  (e.g. query param `?scrollTo=projects` or a client store) because `location.state` does
  not survive the same way. Producers: `ProjectPage.jsx:165`, `ArticlePage.jsx:241–243`.
- Hash anchors on home: `#hero`, `#projects`, `#skills`, `#gallery`, `#articles`, `#contact`,
  `#about`, `#experience`, `#education`, `#activities`, `#achievements`, `#contact`
  (Header NAV_ITEMS, Sidebar navItems, Hero).
- `Sidebar.jsx` and `Pagination.jsx` are orphaned for the public/sections surface (see §21).
- `Analytics` from `@vercel/analytics/react` is mounted once in `App.js`; use
  `@vercel/analytics/next` in App Router.

---

## 7. Pages

All 8 files in `src/pages/`. Every page is the **default export**; none has named exports.

### 7.1 `Home.jsx` (107 lines)
- Props `{ isDownloading, handleDownload }`.
- Reads `usePortfolio()`; loading gate `Center`+`Spinner`.
- `useLayoutEffect` scroll-to-anchor from `location.state.scrollTo` (SSR-unsafe; must be
  a client effect / `useEffect`).
- `<Helmet>`: title `personalInfo.seoTitle || DEFAULT_TITLE`, canonical `absoluteUrl("/")`,
  description, author, keywords, full OG + Twitter, JSON-LD Person + WebSite.
- Renders `<Layout>` wrapping 11 sections in order: `Hero, About, Experience, Projects,
  Skills, Education, Gallery, Articles, PlaygroundPreview, ArcadePreview, Contact`.
- `imageUrl = absoluteUrl("/profilepic.png")`.

### 7.2 `Login.jsx` (322 lines)
- No props. State: `email`, `password`, `showPassword`, `loading`.
- Uses `loginAdmin` from `authService`, `useAuth()`, `useToast()`, `useNavigate()`.
- Effect: if `currentUser && isAdminUser` → navigate `/dashboard-secure-panel`.
- Submits → `loginAdmin(email,password)` → navigate dashboard; toasts for missing
  credentials / success / failure.
- Hardcoded `LOGIN_FEATURES` (3 items). **No `<Helmet>`** (MISSING — no SEO meta).
- Chakra: `Box, Button, Container, Divider, FormControl, FormLabel, Grid, HStack,
  IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Link, SimpleGrid,
  Stack, Text, VStack, useToast`. Icons: `ArrowLeft, Eye, EyeOff, FileText, FolderOpen,
  Lock, Mail, ShieldCheck, UserRound`.
- Uses `useStudioColors()` tokens; wordmark `aurio.work`.

### 7.3 `NotFound.jsx` (93 lines)
- Props `{ code = "404", title = "Page not found", message }`; reused for `/503`.
- GSAP entrance via `useGSAP` + data attributes `[data-error-code]`, `[data-error-reveal]`.
- `<Helmet>`: title, description, `robots noindex, follow`. No OG/JSON-LD.
- Chakra: `Box, Button, Container, Heading, Link, Text, VStack`; icon `ArrowLeft`.
- CTA is `Button as={Link} href="/"` (plain anchor, full reload).

### 7.4 `ProjectPage.jsx` (382 lines)
- Props `{ isDownloading, handleDownload }` → `Header`.
- `useParams().slug`, `useNavigate`, `usePortfolio()`, `normalizeProjects`.
- Loading gate; not-found gate (with its own `<Helmet noindex>`).
- `<Helmet>`: title, canonical, description, author, keywords, OG (`article`), Twitter,
  JSON-LD `createProjectSchema` + `createBreadcrumbSchema`.
- Gallery with `activeIndex`; `LazyLoadImage`; sticky sidebar; highlights, tags, GitHub /
  Website buttons (`variant="studioGhost"` / `"studio"`).
- Back navigation calls `navigate("/", { state: { scrollTo: "projects" } })`.

### 7.5 `ArticlePage.jsx` (577 lines)
- Props `{ isDownloading, handleDownload }` (Header render is **commented out** at line 227).
- `useParams().slug`, `loadArticle` (`Promise.all([getArticleBySlug, getAllArticles])`
  wrapped in a local `withTimeout(promise, 4500)`), related-articles algorithm, `copied`
  clipboard state.
- `<Helmet>`: title, canonical, description, OG (`article` incl. published/modified time),
  Twitter, JSON-LD Article + Breadcrumb.
- Reading-progress bar via GSAP ScrollTrigger scrub; hero + body via
  `dangerouslySetInnerHTML={{ __html: article.description }}`; sidebar share links
  (Twitter/Facebook/LinkedIn) + topics + related list.
- Chakra `sx` typography object for `.article-body` (p, h1–h4, blockquote, lists, img, a,
  pre, code, hr).
- SSR-unsafe: `navigator.clipboard` (101), `window.prompt` fallback (105), `dangerouslySetInnerHTML`
  (411), GSAP/ScrollTrigger, `new Date` formatting.
- `withTimeout` helper duplicated locally (24–30) — same pattern as `PortfolioContext`.
- Error path only `console.error("Error loading article:", e)`; **no error UI** (loading
  just becomes false → renders not-found card). See §16.

### 7.6 `Playground.jsx` (952 lines)
See full detail in §13.4. Default export `Playground`, props `{ isDownloading, handleDownload }`.
8 tools driven by local `activeTool` state (`Startup` tool registry `TOOLS`). Contains only
client-side tools; `TriviaArena` and `MovieFinder` are self-contained child components.
**SSR hazard:** `const DEFAULT_DATE = new Date().toISOString();` at module scope (line 44).

### 7.7 `Arcade.jsx` (1096 lines)
See full detail in §13. Default export `Arcade`, props `{ isDownloading, handleDownload }`.
Owns game registry `GAMES` (9 entries), shop/passport drawers, coin/mute/CRT controls,
AI coach (Gemini with static fallback), and an error boundary (`ArcadeGameBoundary`).
Each game is a zero-prop component rendered as `<ActiveGame />` with `key={activeGame}`.

### 7.8 `AdminDashboard.jsx` (1163 lines)
See §8.2. Default export `AdminDashboard`, rendered inside `ProtectedRoute`. 9 modules:
`overview, profile, projects, articles, experience, education, achievements, activities,
data`. Uses modals for article editor/preview and delegates to admin manager components.

---

## 8. Components inventory

### 8.1 Layout & shared style primitives
- `src/components/layout/Header.jsx` (457 lines) — default export `Header`, props
  `{ isDownloading, handleDownload }`. Sticky nav; `NAV_ITEMS` (Intro `#hero`, Work
  `#projects`, Practice `#skills`, Archive `#gallery`, Writing `#articles`, Contact
  `#contact`); `useLocation` for `isHome`; scroll listener; `IntersectionObserver`
  active-section; GSAP pill + scroll-progress; custom mobile overlay; `useColorMode()`
  for theme toggle. SSR-unsafe: `window.scrollY`, `scroll` listener, `document.querySelector`,
  `IntersectionObserver`, `gsap.to(window,{scrollTo})`. Chakra `Button` variants `studio`/`studioGhost`.
- `src/components/layout/Layout.jsx` (233 lines) — default export `Layout`, props
  `{ children, isDownloading, handleDownload }`. Renders `Header` + `<main>` + footer +
  scroll-to-top button. `year = new Date().getFullYear()`. Large CTA footer block is
  commented out (112–152). SSR-unsafe: `window.scrollY`, `scroll` listener, `window.scrollTo`.
- `src/components/layout/Sidebar.jsx` (109 lines) — default export `Sidebar`, no props.
  **Orphaned / dead code** (no importer). Uses `retro.js` + `usePortfolio`. Do not port.
- `src/components/public/studio.js` (152 lines) — named exports `useStudioColors`,
  `StudioPill`, `StudioSection`, `SplitWords`.
  - `useStudioColors()` returns `{ bg, bgWash, surface, surfaceSolid, surfaceAlt, text,
    muted, border, borderSoft, primary, primaryDark, accent, accentSoft, glow, overlay }`
    (light/dark via `useColorModeValue`).
  - `StudioPill({ children, tone = "primary", ...props })`, tones `primary | accent | ghost`.
  - `StudioSection({ id, eyebrow, title, children, align = "start", maxW = "1180px", ...props })`
    renders `<section>` with optional heading row (`data-studio-heading`, `data-heading-rule`).
  - `SplitWords({ text, ...props })` splits into `.split-word` / `.split-word-inner` spans.
- `src/components/ui/retro.js` (152 lines) — named exports `useRetroColors` (spread of
  studio colors + `pageBg, panelBg, panelAlt, headerBg, headerDark, link, linkDark,
  paleBlue, amber, green, red, shadow`), `RetroPanel({ id, title, icon, actions, children,
  footer, headerRight, bodyProps })`, `RetroBadge({ children, tone = "blue" })` (tones
  `blue|amber|green|red|gray`), `RetroDivider()`.

### 8.2 Admin components (`src/components/admin/`)
All are **default-export only** and use controlled local state (no react-hook-form, despite
`src/hooks/useForm.js` existing).

| File | Default export | Props | Notes |
|---|---|---|---|
| `ProjectManager.jsx` | `ProjectManager` | `{ openCreateSignal = 0, onDataChange }` | Modal list + delete AlertDialog + reorder + Pagination |
| `ProjectForm.jsx` | `ProjectForm` | `{ data, onSave, onCancel }` | Fields: title, description, slug, role, period, status, tags, image, highlights, gallery, github, website; Cloudinary migration on save |
| `ProjectGalleryInput.jsx` | `ProjectGalleryInput` | `{ value = [], onChange }` | Media items `{ id, type:"image", url, title, caption, alt, thumbnail, order }`; FileReader preview |
| `PortfolioDataManager.jsx` | `PortfolioDataManager` | `{ onDataChange }` | Raw JSON editor + Initialize/Reset |
| `PersonalInfoEditor.jsx` | `PersonalInfoEditor` | `{ onDataChange }` | name,title,email,github,linkedin,website,twitter,location,bio,seoTitle,seoDescription |
| `ExperienceManager.jsx` | `ExperienceManager` | `{ onDataChange }` | `window.confirm` delete |
| `ExperienceForm.jsx` | `ExperienceForm` | `{ data, onSave, onCancel }` | company,position,period,location,type,logo,description[],technologies[] |
| `EducationManager.jsx` | `EducationManager` | `{ onDataChange }` | Tabs Formal/Certifications; `window.confirm` |
| `EducationForm.jsx` | `EducationForm` | `{ data, type, onSave, onCancel }` | `type = "education" | "certification"` |
| `ArticleList.jsx` | `ArticleList` | `{ onEdit, onView, refresh, articlesData, externalLoading, onDataChange }` | Popover+Portal share menu (`react-share`), `window.location.origin` share URLs |
| `ArticleEditor.jsx` | `ArticleEditor` | `{ article, onSuccess, onCancel }` | `ReactQuill` rich text; **not SSR-safe**; category select; visibility; featured Switch |
| `ActivityManager.jsx` | `ActivityManager` | `{ onDataChange }` | `window.confirm` |
| `ActivityForm.jsx` | `ActivityForm` | `{ data, onSave, onCancel }` | title,role,organization,period,description,image |
| `AchievementManager.jsx` | `AchievementManager` | `{ onDataChange }` | `window.confirm` |
| `AchievementForm.jsx` | `AchievementForm` | `{ data, onSave, onCancel }` | title,issuer,date,description,image |

Shared UI used by admin:
- `ui/ImageUpload.jsx` — `{ value, onChange, label = "Image", previewHeight = "200px", immediateUpload = false }`.
- `ui/ArrayInput.jsx` — `{ value = [], onChange, label, placeholder = "Add item" }`.
- `ui/Pagination.jsx` — `{ currentPage, totalPages, onPageChange }` (uses `facebookGray` variant). **Not used by sections** (Projects has its own).
- `ui/retro.js`, `public/studio.js` as above.

Other `ui/`:
- `SectionTitle.jsx` — `{ children, id }`, `Heading as="h2"` with bottom border. (Usage UNCLEAR — needs verification; sections use `StudioSection`.)
- `Divider.jsx` — no props, hardcoded `borderTop="1px solid black"`. (Effectively unused; Gallery uses Chakra `Divider`.)
- `ProjectShowcaseModal.jsx` — `{ project, isOpen, onClose }`; keyboard nav (Arrow keys, +/-, 0), pinch/wheel zoom, GSAP entrance.
- `CertificateModal.jsx` — `{ isOpen, onClose, image, title }`.
- `ActivityModal.jsx` — `{ isOpen, onClose, activity }`.

### 8.3 Section components (`src/components/sections/`)
All default-export, all zero-prop; data via `usePortfolio()` unless noted.

| File | Data | Animations (`data-*` hooks) |
|---|---|---|
| `Hero.jsx` | `personalInfo` | `.split-word-inner`, `[data-hero-reveal]`, badge, strap; pointer-follow `quickTo` |
| `About.jsx` | `personalInfo` + stats from projects/experiences | `[data-about-reveal]`, `[data-about-line]` |
| `Experience.jsx` | `experiences` | `[data-exp-line]`, `[data-exp-item]` |
| `Projects.jsx` | `normalizeProjects(projects)`, `PAGE_SIZE=8` | `[data-project-cell]`; own pagination; `ProjectShowcaseModal`; case-study `<a href="/project/:slug">` |
| `Skills.jsx` | **imports `skillsData` directly from data file** | marquee ticker + `[data-skill-row]`; `sx` maskImage |
| `Education.jsx` | `[...education, ...certifications]` | `[data-education-item]` |
| `Gallery.jsx` | derived from `achievements` + `activities` | `[data-gallery-item]`; own lightbox Modal |
| `Articles.jsx` | `getAllArticles()` from service (public only) | `[data-article-card]` |
| `PlaygroundPreview.jsx` | static | none |
| `ArcadePreview.jsx` | static, `PREVIEW_GAMES` (9) | none |
| `Contact.jsx` | `personalInfo`; EmailJS send | `[data-contact-reveal]` |
| `Testimonials.jsx` | derived from experiences/achievements with hardcoded fallbacks | `[data-quote]` |
| `Achievements.jsx` | `achievements`; `CertificateModal` | none (RetroPanel) |
| `Activities.jsx` | `activities`; `ActivityModal` | none (RetroPanel) |

`Testimonials.jsx` is not rendered on Home (not in the Home section list). `Skills.jsx`
bypasses context by importing `skillsData` directly — that is intentional/real, preserve it.

### 8.4 Playground components (`src/components/playground/`)
- `MovieFinder.jsx` (default, no props) — TMDB via `movieService`; debounced search;
  genre/select; details modal; `Skeleton`. Chakra: `Alert, AlertIcon, Box, Button, Flex,
  Grid, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, Select, SimpleGrid, Skeleton, Text, useDisclosure`.
- `TriviaArena.jsx` (default, no props) — OpenTDB via `triviaService`; categories,
  difficulty, amount; fallback questions; Progress bar. Chakra: `Alert, AlertIcon, Box,
  Button, Flex, HStack, Progress, Select, SimpleGrid, Spinner, Text, VStack`.

---

## 9. Styling & theme

### 9.1 Chakra theme — `src/styles/theme.js` (432 lines)
`extendTheme` with:
- `config`: `initialColorMode: "light"`, `useSystemColorMode: false`.
- `radii`: **all set to `"0"`** (`none, sm, base, md, lg, xl, 2xl, full`). The visual
  language is intentionally sharp, EXCEPT buttons which override `borderRadius: "999px"`
  in their variants.
- `colors`: `studio` (white/surface/border/ink/charcoal/darkBg/darkSurface/darkBorder/
  darkText/muted), `retro` and `retroDark` (ink/inkSoft/chrome/chromeDark/paper/panel/
  line/lineSoft/blue/blueDark/bluePale/amber/green/red/black — accent "blue" is
  neutralized to charcoal/white), legacy `facebook`/`facebookDark`.
- `semanticTokens.colors`: `public.bg`, `public.surface`, `public.surfaceAlt`,
  `public.text`, `public.muted`, `public.border`, `public.primary`, `public.primaryDark`,
  `public.accent`, `public.glow` with `default`/`_dark` values.
- `fonts`: heading/body `'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif`;
  mono `'Lucida Console', 'Courier New', monospace`.
- `styles.global`: body bg `#fafaf8`/`#1e1e1e`, color `#1a1a1a`/`#eaeaea`, font-size 16px,
  line-height 1.65, smooth scroll, custom scrollbars, `*::selection`, link colors neutral,
  `overflowWrap`.
- `components`:
  - `Button.baseStyle`: `fontWeight 600`, `fontSize 15px`, `borderRadius 999px`, transitions.
  - `Button.variants`: `studio`, `studioGhost` (public), `facebook`, `facebookGray`,
    `outline` (admin). Exact hex per variant is in §24.
  - `Input`/`Textarea`/`Select`: `outline` variant themed (borderRadius `14px`, minH 42px,
    focus ring `0 0 0 1px <color>`), `defaultProps.variant = "outline"`.
  - `FormLabel`, `Modal` (dialog radius `24px`, header/footer borders), `Heading`, `Text`,
    `Tag` (pill).
- `App.test.js` asserts: initialColorMode light, `useSystemColorMode` false, all radial
  tokens `0` except full, and `public.primary._dark === "#f5f5f2"`.

### 9.2 Emotion / `sx` / `css`
- `sx` used in `Skills.jsx` (maskImage), `Arcade.jsx` (scrollbar hiding), `ArticlePage.jsx`
  (article typography).
- `css` prop used in `Playground.jsx` (scrollbar hiding).
- No Tailwind, no CSS modules, no styled-components.

### 9.3 Global CSS — `src/index.css`
Only an `.spin` class + `@keyframes arcade-spin`; used by `Loader2` spinners in `Arcade.jsx`.

### 9.4 GSAP setup — `src/utils/gsap.js`
Registers `Flip`, `MotionPathPlugin`, `ScrollTrigger`, `ScrollToPlugin`, `TextPlugin`;
exports `gsap` and `prefersReducedMotion()` (guards `typeof window`). All animated
components guard on `prefersReducedMotion()`.

---

## 10. State management & contexts

No Redux/Zustand. State is React local state + two contexts + module-singleton services.

### 10.1 `src/contexts/AuthContext.js` (54 lines)
- Named exports only: `useAuth`, `AuthProvider`. No default export.
- Provides exactly `{ currentUser, isAdminUser, loading }`. **No `signIn`/`signOut`.**
  Login/logout are direct `authService` calls.
- On mount: 4500 ms fallback timer clears `loading`; subscribes with `checkAuthState`
  (`onAuthStateChanged`); cleanup unsubscribes.

### 10.2 `src/contexts/PortfolioContext.js` (90 lines)
- Named exports `usePortfolio`, `PortfolioProvider`.
- Provides `{ portfolioData, loading, useFirebase, refreshPortfolioData }`.
- `FIREBASE_LOAD_TIMEOUT_MS = 4500`. Loads `getPortfolioData()` with timeout, falls back to
  local `src/data/portfolioData.js`. `portfolioData` shape:
  `{ personalInfo, experiences, projects, education, certifications, achievements, activities }`.

### 10.3 Other state modules
- `src/services/shopService.js` exposes a `useShopState(gameId)` hook backed by a module
  listener `Set` + `window` `storage` event (cross-tab sync). Modules are singletons.
- `src/hooks/useForm.js`, `useGsapReveal.js`, `useThemeToggle.js` exist but are **not
  imported by any component** (dead hooks). `useGsapReveal` wraps `useInView`.

**Next.js mapping:** both providers become client provider components in `app/layout.tsx`
(or `app/providers.tsx`). `AuthContext`/`PortfolioContext` can stay client-side. The
`4500 ms` timeouts must be preserved so the UI never hangs.

---

## 11. Data layer, services & APIs

All in `src/services/`. Firebase RTDB paths: root `portfolio` and root `articles`.

### 11.1 `src/config/firebase.js` (26 lines)
Initializes `initializeApp`, exports `app`, `auth` (getAuth), `database` (getDatabase),
`storage` (getStorage), from `REACT_APP_FIREBASE_*` env vars. Runs at import time.

### 11.2 `authService.js` (45 lines)
- `ADMIN_EMAIL = "riorajaa2018@gmail.com"` (line 9) — hardcoded gate.
- `isAdmin(user)` → `user && user.email === ADMIN_EMAIL`.
- `loginAdmin(email, password)` → `signInWithEmailAndPassword`; if non-admin, `signOut`
  and throws `"Unauthorized: You do not have admin privileges"`.
- `logoutAdmin()` → `signOut`.
- `checkAuthState(cb)` → `onAuthStateChanged`.

### 11.3 `portfolioService.js` (141 lines) — RTDB root `"portfolio"`
`initializePortfolioData`, `getPortfolioData` (one-shot `get`), `updatePersonalInfo`,
`updateExperiences`, `updateProjects`, `updateEducation`, `updateCertifications`,
`updateAchievements`, `updateActivities`, `updateSkills`, `updatePortfolioData`.

### 11.4 `articleService.js` (160 lines) — RTDB root `"articles"`
`calculateReadTime` (strip HTML, 200 wpm, `"N min read"`), `createArticle` (push key = id,
unique slug, sets `slug/readTime/author: "Aurio Rajaa"/date`), `getAllArticles`,
`getFeaturedArticles`, `getArticleById`, `getArticleBySlug`, `updateArticle` (recomputes
readTime/slug), `deleteArticle`, `getArticlesByCategory`.

### 11.5 `cloudinaryService.js` (238 lines)
- `CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dfohyltdw"`,
  `CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET`.
- `uploadImage`, `uploadImageUrl`, `uploadMediaWithProgress` (XHR), `deleteImage`
  (**no-op** — needs signed backend delete), `uploadImageWithProgress` (XHR),
  `validateImageFile` (5 MB; jpeg/png/gif/webp), `validateMediaFile` (12 MB).

### 11.6 `movieService.js` (90 lines) — TMDB
`getMovieGenres`, `searchMovies`, `getMovieDetails`, `getMovieImageUrl`; base
`https://api.themoviedb.org/3`; env `REACT_APP_TMDB_API_KEY`; `FALLBACK_GENRES`.
Uses `publicApi.fetchJson`.

### 11.7 `triviaService.js` (73 lines) — Open Trivia DB
`getTriviaQuestions`, `TRIVIA_CATEGORIES`, `FALLBACK_TRIVIA`; base
`https://opentdb.com/api.php`; `decodeHtml` uses `document.createElement("textarea")`
(**SSR-unsafe**); `shuffle` uses `Math.random`.

### 11.8 `geminiService.js` (151 lines)
- Model `gemini-1.5-flash`, base `https://generativelanguage.googleapis.com/v1beta/models`,
  env `REACT_APP_GOOGLE_API_KEY`, cache prefix `arcade:gemini:`, 12 s request timeout,
  6 h default TTL / 24 h cache TTL, 1200 ms rate limiter, `AbortController`.
- Exports `getGeminiKey`, `isGeminiAvailable`, `geminiGenerate({ prompt, system, cacheKey,
  ttlMs, signal })` returning `{ ok, text?, cached?, reason? }`. Never logs the key.

### 11.9 `publicApi.js` (68 lines)
`PublicApiError` (codes `MISSING_KEY, EMPTY, UNAUTHORIZED, RATE_LIMIT, TIMEOUT,
NETWORK_ERROR, INVALID_RESPONSE, SERVER_ERROR, NOT_FOUND, ABORTED`, `HTTP_ERROR`),
`fetchJson(url, { signal, timeoutMs = 8000 })` (uses `window.setTimeout`), and
`getPublicApiMessage(error, fallback)`.

### 11.10 `shopService.js` (563 lines) & `arcadeService.js` (929 lines)
Documented in §13/§14.

### 11.11 `api/article.js` (serverless)
Vercel handler. Reads `FIREBASE_DATABASE_URL || REACT_APP_FIREBASE_DATABASE_URL`, fetches
`<db>/articles.json`, finds by slug, and injects SEO meta into `build/index.html` (or
`public/index.html`). Non-public/missing articles get the unmodified shell with
`s-maxage=60, stale-while-revalidate=300`; found articles get `s-maxage=300,
stale-while-revalidate=3600`. `SITE_URL=https://aurio.work`. This is the model for a
Next.js `app/article/[slug]/page.tsx` `generateMetadata` (or a Route Handler).

---

## 12. Assets

`public/`:
- Icons: `favicon.ico`, `favicon-48x48.png`, `favicon-192x192.png`, `apple-touch-icon.png`,
  `portfolio.png`.
- Profile: `profilepic.png` (preloaded; used in Hero, Sidebar, JSON-LD, OG).
- CV: `CV_AurioRajaa.pdf` (downloaded from `${origin}/CV_AurioRajaa.pdf`).
- Certificates/activities: `sertif-huawei.png`, `sertif-msib-stupen.jpeg`,
  `sertif-applied-ml.png`, `sertif-becoming-cloud-engineer.jpeg`, `EXPECTIK-*.png`,
  `OP-2024.png` (referenced by `src/data/portfolioData.js`).
- `manifest.json`, `robots.txt`, `sitemap.xml`.
- Image loading: `react-lazy-load-image-component` with `effect="opacity"` in
  Achievements, Activities, Articles, Education, Experience, Gallery, Hero, Projects.
  CSS imported once in `index.js`. Plain `<img>` in `ProjectShowcaseModal`; Chakra `Image`
  in Certificate/Activity modals.

**Next.js mapping:** `LazyLoadImage` → `next/image` (preserve eager/high priority on Hero).
`profilepic.png`/certificates can stay in `public/` or move to `next/image` with explicit
sizes. The `opacity` effect CSS becomes unnecessary.

---

## 13. Arcade games subsystem

This is the largest and most stateful area. Read this section fully before touching
`src/services/arcadeService.js`, `src/services/shopService.js`, `src/pages/Arcade.jsx`,
or `src/components/arcade/*`.

### 13.1 `Arcade.jsx` page structure
Root `<Box minH="100vh">` → `Helmet` → CRT overlay (conditional) → `Header` →
`Container maxW="6xl"`:
1. Retro marble banner (INSERT COIN, SHOP, CRT, Sound, PASSPORT buttons; title
   "The Retro Arcade Corner"; hotkey hint).
2. Mobile game selector (`display={{base:"block", md:"none"}}`).
3. Desktop game cards grid (`repeat(3, minmax(0,1fr))`).
4. AI Arcade Coach (Gemini description/tip/recommendation, with offline note).
5. Active game stage → `<ArcadeGameBoundary key={activeGame}>` → `<ActiveGame />`.
6. `Arcade Passport` Drawer (badges progress, total sessions, coin wallet, achievements).
7. `Arcade Shop` Drawer (grouped items: Skins, Equipment & Power-Ups, BGM Music,
   Collectible Assets; buy/equip/unequip; Insert Coin; Done).

Local `class ArcadeGameBoundary extends React.Component` (error boundary) wraps the active
game; "Try again" resets via `setState`.

### 13.2 Game registry (`GAMES`, Arcade.jsx:83–165)
| id | label | icon | color | hotkey | keyNum |
|---|---|---|---|---|---|
| `2048` | 2048 Mini | `Grid2X2` | `#ffca3a` | 1 | |
| `snake` | Snake | `Route` | `#0bbfa0` | 2 | |
| `pong` | Pong | `Disc` | `#ff9f68` | 3 | |
| `tictactoe` | Tic-Tac-Toe | `Hash` | `#00f5d4` | 4 | |
| `rps` | Rock Paper Scissors | `Swords` | `#9b5de5` | 5 | |
| `whacamole` | Whac-a-Mole | `Hammer` | `#8ac926` | 6 | |
| `memory` | Memory Match | `Brain` | `#f15bb5` | 7 | |
| `dodge` | Reaction Dodge | `Zap` | `#00bbf9` | 8 | |
| `runner` | Endless Runner | `Rabbit` | `#ff6b6b` | 9 | |

Selection: `activeGame` state + `selectGame(id)` (selectingRef guard, ~180 ms fake spinner)
and global keys `1`–`9`. `active = GAMES.find(...) || GAMES[0]`, `ActiveGame = active.component`.
Games receive **no props**; they self-report scores via `recordGameSession(gameId, value)`.

`STATIC_TIPS` and `STATIC_DESCRIPTIONS` (Arcade.jsx:167–190) are Gemini fallbacks.

### 13.3 Game components (`src/components/arcade/`)
All default-export, zero-prop. Common imports: `useStudioColors()`,
`{ arcadeAudio, arcadeHaptics, loadArcadeStats, recordGameSession }`,
`getShopSnapshot(gameId)`. All use Chakra button variants `studio`/`studioGhost`.

| File | Export | Canvas | Shop usage | BGM id | recordGameSession value | SSR hazards |
|---|---|---|---|---|---|---|
| `2048Game.jsx` (435) | `Game2048` | no (grid) | `skin.tiles`, perk `"2048HeadStart"` | `"2048"` | best score | keydown, `Math.random` |
| `Snake.jsx` (575) | `Snake` | `setupHiDPICanvas(ref,320,320)` | `skin.colors`, `snakeAppleScore` | `"snake"` | final score | keydown, setTimeout, Math.random |
| `Pong.jsx` (531) | `Pong` | `setupHiDPICanvas(ref,640,400)` | `skin.colors`, `pongPaddleScale` | `"pong"` | `{winStreak}` / `{bestStreak}` | RAF, document.hidden, keydown |
| `TicTacToe.jsx` (403) | `TicTacToe` | no | `skin.colors`, `tttHint` | `"tictactoe"` | `{wins,losses,draws}` | setTimeout, Math.random |
| `RockPaperScissors.jsx` (440) | `RockPaperScissors` | no (SVG hands) | `skin.colors` only | `"rps"` | `{wins,losses,ties}` | setInterval/setTimeout |
| `WhacAMole.jsx` (434) | `WhacAMole` | no (DOM) | `skin.colors`, `moleExtraMs`, `moleScoreMult` | `"whacamole"` | best score | setInterval/setTimeout, performance.now |
| `MemoryMatch.jsx` (305) | `MemoryMatch` | no | `skin.colors`, `memoryPeek` | `"memory"` | moves (bestMoves) | setTimeout, Math.random |
| `ReactionDodge.jsx` (611) | `ReactionDodge` | `setupHiDPICanvas(ref,360,420)` | `skin.colors`, `dodgeShield` | `"dodge"` | score | RAF, document.hidden, pointer, Math.random |
| `EndlessRunner.jsx` (754) | `EndlessRunner` | `setupHiDPICanvas(ref,600,340)` | `skin.colors`, `runnerMagnet` | `"runner"` | total score | RAF, document.hidden, keydown, Math.random |

`canvasUtils.js` — `setupHiDPICanvas(canvas, logicalWidth, logicalHeight)`; reads
`window.devicePixelRatio || 1` (guarded), sets backing store + transform, disables image
smoothing. Returns 2D context or null.

`HandAssets.jsx` — exports `RockHand`, `PaperHand`, `ScissorsHand` (Chakra `Box` + inline
100×100 SVG, props `{ size = 84, color, isShaking, ...props }`, injects `rpsShake` keyframes).

### 13.4 Playground details
`Playground.jsx`: `TOOLS` registry (json, text, url, base64, date, color, trivia, movies).
Local helper components: `FieldLabel`, `ToolShell`, `CopyButton`, `OutputBox`, `ToolButton`,
`JsonTool`, `TextTool`, `ConvertTool`, `DateTool`, `ColorTool`, `Challenge`. No services
imported at page level. `TriviaArena`/`MovieFinder` encapsulate their own services.

### 13.5 Audio engine (`arcadeService.js`)
- Module singleton `export const arcadeAudio = new ArcadeAudio();` at line 671. The
  constructor reads `window.localStorage` and adds a `document` `visibilitychange`
  listener — **import-time browser side effect**.
- `BGM_THEMES`: `default` (Studio Mix), `neon-lounge`, `midnight-synth`, `ocean-drift`.
- `BGM_TRACKS`: one composition per game id (`"2048"`, `snake`, `pong`, `tictactoe`, `rps`,
  `whacamole`, `memory`, `dodge`, `runner`). Procedural Web Audio; no audio assets.
- SFX API: `playTone`, `playCoin`, `playMove`, `playScore`, `playWhack`, `playJump`,
  `playClick`, `playHit`, `playWin`.
- BGM API: `startBgm(gameId, { force })`, `stopBgm({ fade })`, `preloadBgm`, `setMuted`,
  `toggleMute`, `getMuted`, `getTheme`, `setBgmTheme`. Pauses on tab hidden, resumes on
  visible; fades in/out. `arcadeHaptics` wraps `navigator.vibrate`.
- CRT prefs: `getCrtMode()`, `setCrtMode(enabled)`.

---

## 14. Persistence & localStorage keys

All persistence is `window.localStorage`. No IndexedDB/cookies/sessionStorage (Firebase
Auth manages its own persistence internally).

| Key | Written by | Read by | Notes |
|---|---|---|---|
| `arcade:audio:muted` | `arcadeService.setMuted` | `ArcadeAudio` ctor | `"true"`/`"false"` |
| `arcade:audio:theme` | `setBgmTheme`; shop purchase/equip | `ArcadeAudio` ctor | theme id |
| `arcade:display:crt` | `setCrtMode` | `getCrtMode` | CRT scanlines |
| `arcade:stats:v2` | `saveArcadeStats` | `loadArcadeStats` | unified stats object |
| `arcade:achievements:v1` | `unlockAchievement` | `getUnlockedAchievements` | array of ids |
| `arcade:coins:v1` | `saveCoins`/`addCoins`/`spendCoins` | `loadCoins` | start 25, max 500000 |
| `arcade:shop:purchases:v1` | `purchaseItem` | `loadPurchases` | array of item ids |
| `arcade:shop:equipped:v1` | `equipItem`/`unequipItem` | `loadEquipped` | map key→item id |
| `arcade:gemini:<safeKey>` | `writeCache` | `readCache` | `{ at, t }`, 24 h TTL |
| legacy `arcade:<game>:best/streak/score` | game migrations + `recordGameSession` | `getLegacyScore` | 9 keys, migrated into stats |
| `chakra-ui-color-mode` | Chakra (implicit) | Chakra | light/dark |

Legacy keys (arcadeService.js:773–783): `arcade:2048:best`, `arcade:snake:best`,
`arcade:pong:streak`, `arcade:tictactoe:score`, `arcade:rps:score`, `arcade:whacamole:best`,
`arcade:memory:best`, `arcade:dodge:best`, `arcade:runner:best`.

Shop keys are documented with the full catalog in `shopService.js` (`COINS_KEY`,
`PURCHASES_KEY`, `EQUIPPED_KEY`; `STARTING_COINS = 25`, `MAX_COINS = 500000`).

**Migration note:** if the Next.js app must preserve returning users, keep these exact
keys and value shapes. `shopService` cross-tab sync listens for `storage` events on
`[COINS_KEY, PURCHASES_KEY, EQUIPPED_KEY, "arcade:audio:theme"]`. All reads/writes are
wrapped in try/catch and are safe when storage is unavailable.

---

## 15. Environment variables & configuration

All client env vars are `REACT_APP_`-prefixed and **committed in `.env`** (values are
exposed in the client bundle; treat as public). The migration must rename them to
`NEXT_PUBLIC_`.

| Variable | Used by |
|---|---|
| `REACT_APP_EMAILJS_SERVICE_ID` | `Contact.jsx` |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | `Contact.jsx` |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | `Contact.jsx` |
| `REACT_APP_FIREBASE_API_KEY` | `config/firebase.js` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `config/firebase.js` |
| `REACT_APP_FIREBASE_DATABASE_URL` | `config/firebase.js` (also `FIREBASE_DATABASE_URL` in `api/article.js`) |
| `REACT_APP_FIREBASE_PROJECT_ID` | `config/firebase.js` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `config/firebase.js` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `config/firebase.js` |
| `REACT_APP_FIREBASE_APP_ID` | `config/firebase.js` |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | `config/firebase.js` |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | `cloudinaryService.js` (fallback `"dfohyltdw"`) |
| `REACT_APP_CLOUDINARY_UPLOAD_PRESET` | `cloudinaryService.js` |
| `REACT_APP_TMDB_API_KEY` | `movieService.js` |
| `REACT_APP_GOOGLE_API_KEY` | `geminiService.js` |

Non-prefixed `FIREBASE_DATABASE_URL` is read by `api/article.js:41` (server-side). In
Next.js keep DB access server-only where possible (Route Handlers / Server Components /
`generateMetadata`), and only expose `NEXT_PUBLIC_*` for genuinely client-side features
(TMDB, Gemini, EmailJS, Firebase client SDK, Cloudinary preset).

Other constants: `SITE_URL="https://aurio.work"`, `SITE_NAME="aurio.work"`,
`ADMIN_EMAIL="riorajaa2018@gmail.com"`, `STARTING_COINS=25`, `MAX_COINS=500000`,
`FIREBASE_LOAD_TIMEOUT_MS=4500`.

---

## 16. Error handling & resilience

- Firebase calls are wrapped in try/catch with `console.error`; contexts use 4500 ms
  timeouts and local-data fallbacks so the app never hangs.
- `ArcadeGameBoundary` (class error boundary) isolates a crashing game; "Try again" resets.
- `geminiService` degrades to `{ ok:false }` and `Arcade.jsx` shows static tips/descriptions.
- `movieService`/`triviaService` fall back to `FALLBACK_GENRES` / `FALLBACK_TRIVIA`.
- `publicApi` maps HTTP/network errors to friendly messages.
- `ArticlePage` swallows load errors with only `console.error` and no user-facing error UI
  (gap — `UNCLEAR` whether intentional).
- `cloudinaryService.deleteImage` is a no-op (server-signed deletion not implemented).

---

## 17. Accessibility

Findings only — no automated a11y test suite exists (`MISSING`).

- Icons: many have `aria-label` (password toggle, copy output, drawer close, CRT/sound
  buttons, zoom controls). Some decorative lucide icons are not `aria-hidden`.
- `SplitWords` splits text into spans marked `aria-hidden` — verify screen-reader output
  of Hero headings after migration.
- Chakra `Modal`/`Drawer` provide focus trapping; `AlertDialog` uses
  `leastDestructiveRef`; `ProjectShowcaseModal` implements keyboard navigation.
- Mobile nav is a custom overlay (not a Drawer) in `Header.jsx`; verify focus management.
- Color contrast: the palette is neutral (charcoal/white) with some hardcoded accents in
  the arcade (`#00f5d4`, `#ffca3a`, etc.). `UNCLEAR — needs verification` for WCAG AA.
- Contact form uses native `<input>/<textarea>` without explicit `<label htmlFor>` —
  verify labels.

---

## 18. Testing

- `src/App.test.js` — theme smoke test: renders with theme, asserts `initialColorMode`,
  `useSystemColorMode`, all `radii === "0"` except `full`, and `public.primary._dark`.
- `src/services/arcadeService.test.js` — 6 tests around stats/achievements (`recordGameSession`,
  `unlockAchievement`, migration).
- `src/setupTests.js` — imports `@testing-library/jest-dom`.
- Run: `npm test` (CRA watch mode). All tests currently pass (7 total).
- `MISSING`: no component/E2E tests; no coverage config; no CI config.

**Next.js mapping:** pick a runner (Vitest/Jest + Testing Library) and port these tests;
keep the theme-token assertions because they encode the design contract.

---

## 19. Chakra UI → shadcn/ui migration map

### 19.1 Component mapping

| Chakra | shadcn/ui / replacement |
|---|---|
| `Box`, `Flex`, `HStack`, `VStack`, `Stack`, `Wrap`, `WrapItem`, `Center` | `div` + Tailwind flex/grid utilities |
| `Grid`, `SimpleGrid` | CSS grid / Tailwind `grid` |
| `Text`, `Heading` | typography components or `<p>`/`<h1>` + classes |
| `Button`, `IconButton` | `Button` (custom `cva` variants `studio`/`studioGhost`/`facebook`/`facebookGray`) |
| `Input`, `Textarea`, `Select`, `InputGroup`, `InputLeft/RightElement`, `Switch` | `Input`, `Textarea`, `Select`, `Switch` |
| `FormControl`, `FormLabel`, `FormErrorMessage` | `Label` + `Form` (react-hook-form) |
| `Modal`, `ModalOverlay/Content/Header/Body/CloseButton`, `AlertDialog`, `Drawer` | `Dialog`, `AlertDialog`, `Sheet` |
| `Popover`, `PopoverTrigger/Content/Body`, `Portal` | `Popover`, `PopoverContent` |
| `Tooltip` | `Tooltip` |
| `Tabs`, `TabList`, `TabPanels`, `Tab`, `TabPanel` | `Tabs` |
| `Progress` | `Progress` |
| `Spinner` | `Loader2` (lucide) or `Skeleton` |
| `Badge`, `Tag` | `Badge` |
| `Alert`, `AlertIcon` | `Alert` (custom) |
| `Image` | `next/image` |
| `Divider` | `Separator` |
| `Skeleton` | `Skeleton` |
| `useDisclosure` | local `useState` |
| `useToast` | `sonner` `toast` |
| `useColorMode`, `useColorModeValue`, `colorMode` prop | `next-themes` + CSS variables |
| `mode()` from theme-tools | Tailwind `dark:` variants |
| `@chakra-ui/icons` | `lucide-react` equivalents |

### 19.2 Theme token mapping
- Radii: set Tailwind `--radius: 0` (with explicit pill overrides on buttons).
- Colors: port `public.*` semantic tokens to shadcn CSS variables (`--background`,
  `--foreground`, `--card`, `--muted`, `--border`, `--primary`, `--accent`) and add a
  `dark` block with the exact `_dark` values from §24.
- Fonts: `next/font/google` Plus Jakarta Sans; set `--font-sans`.
- Button variants: recreate `studio`, `studioGhost`, `facebook`, `facebookGray`, `outline`
  in `buttonVariants` (cva) with the exact hex values per mode.
- Global styles: port body bg/color, smooth scroll, custom scrollbars, `*::selection`,
  link color/hover, `overflowWrap`.

### 19.3 Per-area notes
- Public sections and pages use mostly `Box/HStack/VStack/Grid/Text/Button/Modal` — a
  straightforward mapping.
- Arcade uses `Drawer`, `Progress`, `Tooltip`, `SimpleGrid`, `useDisclosure`, `useToast`,
  and many hardcoded hex colors; keep those exact colors (not theme tokens).
- Admin uses `Modal`, `AlertDialog`, `Popover+Portal`, `Tabs`, `Switch`, `Pagination`,
  and custom `facebook*` variants.
- `react-quill` (ArticleEditor) and Cloudinary XHR uploads must be dynamic
  (`ssr:false`) client components.

---

## 20. Constraints, gotchas & SSR hazards

1. **Import-time browser side effects**
   - `src/utils/gsap.js` registers GSAP plugins at import (guarded `window` for
     `prefersReducedMotion` only).
   - `src/services/arcadeService.js:671` instantiates `arcadeAudio` at module load; the
     constructor reads `localStorage` and attaches a `visibilitychange` listener.
   - `src/services/shopService.js` reads `localStorage` on first call and attaches a
     `storage` listener.
   - `triviaService.decodeHtml` uses `document.createElement`.
   → Any component importing these must be `"use client"`, and prefer `dynamic(..., { ssr:false })`
   for the arcade.
2. **Module-scope date**: `Playground.jsx:44` `DEFAULT_DATE = new Date().toISOString()` —
   causes hydration mismatch on SSR. Move into a lazy initializer.
3. **`Home.jsx` scroll handoff** via `location.state` + `useLayoutEffect` + `document`
   + `window.history.replaceState` — reimplement for App Router.
4. **`dangerouslySetInnerHTML`** in `ArticlePage` (article body) and AdminDashboard preview.
   Sanitize on the server if migrating to Server Components.
5. **`react-router-dom` v7 with v6 API**; `Link as={RouterLink}` and `Button as={Link}`
   patterns must become `Link`/`Button asChild`.
6. **Global pill buttons vs zero radii**: buttons are `999px`, everything else `0`.
7. **`useColorModeValue` SSR**: prefer `next-themes` to avoid hydration flicker; set the
   theme class before paint.
8. **Client-only charts/canvas/timers**: all 4 canvas games use `requestAnimationFrame`,
   `performance.now`, `document.hidden`, and pointer capture.
9. **Committed `.env`**: do not copy secret-looking values into a public repo; rotate if
   needed. Only expose what the client truly needs.
10. **`Sidebar.jsx`, `ui/Divider.jsx`, `Pagination.jsx` (for sections), `useForm`,
    `useGsapReveal`, `useThemeToggle`** are dead/unused — do not port (see §21).
11. **`react-share`, `react-quill`, `react-icons`, `react-copy-to-clipboard`,
    `react-loader-spinner`, `react-tsparticles`, `react-typed`** — verify usage before
    pulling into Next.js (several appear unused).
12. **Firebase client writes** from admin: no server backend; preserve the Firebase
    project or plan a data migration. `api/article.js` proves server-side DB reads are
    expected in production.

---

## 21. Do-not-change files / values

Preserve these exactly during migration unless a separate decision is made:

- **Production URL / SEO constants:** `SITE_URL = "https://aurio.work"`, `SITE_NAME`,
  `DEFAULT_AUTHOR`, `FULL_NAME`, `DEFAULT_IMAGE = "/profilepic.png"`, `DEFAULT_KEYWORDS`,
  and all JSON-LD shapes in `src/utils/seo.js`, `api/article.js`, `public/index.html`.
- **Firebase RTDB paths:** `portfolio`, `articles`.
- **Admin gate:** `ADMIN_EMAIL = "riorajaa2018@gmail.com"`.
- **Admin route literal:** `/dashboard-secure-panel` (must stay for bookmark/back-compat).
- **CV download filename:** `CV_AurioRajaa.pdf`.
- **All `localStorage` keys** in §14 (returning-user continuity).
- **Arcade catalog:** `SHOP_ITEMS` ids/prices/perks, `BGM_THEMES` ids, `BGM_TRACKS` ids,
  `GAMES` ids/colors/hotkeys, achievement ids/thresholds.
- **Theme design contract:** all `radii = "0"`, pill buttons, `public.primary._dark =
  "#f5f5f2"`, `initialColorMode: "light"`, `useSystemColorMode: false` (asserted by tests).
- **Dead code to exclude from port:** `src/components/layout/Sidebar.jsx`,
  `src/components/ui/Divider.jsx`, `src/hooks/useForm.js`, `src/hooks/useGsapReveal.js`,
  `src/hooks/useThemeToggle.js`, `src/App.css`. (Remove only after confirming no dynamic
  imports — none are imported in `src`.)
- **Existing `api/article.js`** — retarget to a Next.js Route Handler / `generateMetadata`,
  do not delete the behavior (SSR meta for articles).

---

## 22. Verification checklist

After migration, confirm:

- [ ] All 9 routes resolve; `/dashboard-secure-panel` still redirects unauthenticated
      users to `/login`.
- [ ] Admin login works with the same Firebase project and `ADMIN_EMAIL`; logout returns
      to `/login`.
- [ ] Portfolio loads from Firebase with the 4500 ms timeout and local fallback intact.
- [ ] Home scroll-to-anchor works from `ProjectPage` and `ArticlePage`
      (`scrollTo: "projects"` / `"articles"`).
- [ ] Article pages have correct server-rendered `<title>`, canonical, OG/Twitter meta and
      JSON-LD (compare against `api/article.js` output).
- [ ] Project pages render gallery, highlights, GitHub/Website buttons, breadcrumbs.
- [ ] `Skills` still reads the static `skillsData` directly.
- [ ] Contact form sends via EmailJS (`REACT_APP_EMAILJS_*` → `NEXT_PUBLIC_*`).
- [ ] Cloudinary uploads work from admin forms; base64 → Cloudinary migration on save.
- [ ] All 9 arcade games play; shop buy/equip/unequip; coins persist; BGM plays only while
      a game is active and stops on game over/exit; mute and CRT toggles persist; stats and
      achievements persist and legacy keys migrate.
- [ ] Playground tools work; Trivia and Movie Finder load (with fallbacks when APIs fail).
- [ ] Theme light/dark toggle works; no hydration mismatch warnings; radii still sharp and
      buttons still pill.
- [ ] `prefers-reduced-motion` disables GSAP reveals.
- [ ] `npm run build` (or `next build`) has 0 errors/warnings and the test suite passes.

---

## 23. Risks & open questions

- **UNCLEAR — needs verification:** usage of `react-icons`, `react-copy-to-clipboard`,
  `react-loader-spinner`, `react-tsparticles`, `react-typed`. They are dependencies but no
  references were found in the read files; confirm with a full grep before porting.
- **UNCLEAR — needs verification:** whether `src/components/ui/SectionTitle.jsx` and
  `src/components/ui/Divider.jsx` are intentionally unused.
- **UNCLEAR — needs verification:** whether `ArticlePage`'s silent error handling is
  acceptable, or an error UI is expected.
- **UNCLEAR — needs verification:** `Sidebar.jsx` dead code status; confirm no dynamic
  import before deleting.
- **UNCLEAR — needs verification:** exact dark-mode visual parity. `useColorModeValue`
  resolves at runtime; `next-themes` hydration must be validated visually.
- **Risk:** committed `.env` means keys are public; changing to server-only routes may
  require Firebase/EmailJS/TMDB/Gemini configuration changes.
- **Risk:** `react-quill@2.0.0` is old; migrating to Next.js may force an editor swap
  (e.g. Tiptap/Lexical) — this changes article HTML, so test round-trips.
- **Risk:** Firebase RTDB read volume/perf for articles (client fetches all articles then
  filters by slug). Consider a server-side `generateMetadata` + indexed lookup.
- **Risk:** `dangerouslySetInnerHTML` from RTDB data — add sanitization during migration.
- **Missing entirely:** TypeScript, Tailwind, CI, `.nvmrc`, license, sitemap generation
  script (static `sitemap.xml` exists), error boundary beyond the arcade.

---

## 24. Appendix: exact token & constant reference

### 24.1 Semantic tokens (`src/styles/theme.js:104–120`)
```
public.bg          #fafaf8  / #1e1e1e
public.surface     #f3f3f0  / #2a2a2a
public.surfaceAlt  #ffffff  / #242424
public.text        #1a1a1a  / #eaeaea
public.muted       #6f6f6a  / #b9b9b4
public.border      #e2e2dd  / #3a3a3a
public.primary     #2c2c2c  / #f5f5f2
public.primaryDark #1a1a1a  / #ffffff
public.accent      #2c2c2c  / #eaeaea
public.glow        rgba(0,0,0,.04) / rgba(0,0,0,.18)
```

### 24.2 Button variants (`theme.js:210–283`)
| Variant | Light bg / color / border | Dark bg / color / border |
|---|---|---|
| `studio` | `#1a1a1a` / `#fafaf8` / `#1a1a1a` | `#eaeaea` / `#1e1e1e` / `#eaeaea` |
| `studioGhost` | transparent / `#1a1a1a` / `#e2e2dd` | transparent / `#eaeaea` / `#3a3a3a` |
| `facebook` | `#1a1a1a` / `#fafaf8` / `#0f0f0f` | `#eaeaea` / `#1e1e1e` / `#c8c8c3` |
| `facebookGray` | `#f3f3f0` / `#1a1a1a` / `#c8c8c3` | `#2a2a2a` / `#eaeaea` / `#3a3a3a` |
| `outline` | `#ffffff` / `#1a1a1a` / `#c8c8c3` | `#242424` / `#eaeaea` / `#3a3a3a` |

All variants: `borderRadius: "999px"`. Inputs/Textarea/Select: radius `14px`, minH `42px`.

### 24.3 Studio color tokens (`useStudioColors()`)
`bg=#fafaf8/#1e1e1e`, `bgWash`, `surface=#f3f3f0/#2a2a2a`, `surfaceSolid`, `surfaceAlt=#ffffff/#242424`,
`text=#1a1a1a/#eaeaea`, `muted=#6f6f6a/#b9b9b4`, `border=#e2e2dd/#3a3a3a`, `borderSoft`,
`primary`, `primaryDark`, `accent`, `accentSoft`, `glow`, `overlay`. (`retro.js` adds
`pageBg, panelBg, panelAlt, headerBg, headerDark, link, linkDark, paleBlue, amber, green,
red, shadow`.)

### 24.4 Achievement catalog (`arcadeService.js:722–771`)
| id | title | threshold |
|---|---|---|
| `first_coin` | Insert Coin | always on first session |
| `snake_pro` | Snake Charmer | snake score ≥ 50 |
| `tile_master` | Tile Maestro | 2048 tile ≥ 256 |
| `pong_streak` | Paddle Wizard | pong streak ≥ 2 |
| `mole_slayer` | Reflex King | 15+ moles in a round |
| `memory_ace` | Memory Ace | memory moves ≤ 22 |
| `dodge_survivor` | Flash Reflex | survive full 20 s (score ≥ 180) |
| `runner_legend` | Cyber Runner | runner score ≥ 80 |

`recordGameSession(gameId, value)` is the only writer of stats/achievements. Per-game
`value` types: number (2048/snake/whacamole/memory/dodge/runner), number streak (pong),
object `{wins,losses,ties}` (rps) or `{wins,losses,draws}` (tictactoe).

### 24.5 Shop catalog summary (`shopService.js:25–307`)
Skins: `skin_snake_amethyst`, `skin_snake_ablaze`, `skin_2048_candy` (with `tiles`),
`skin_pong_arc`, `skin_ttt_void`, `skin_rps_aqua`, `skin_mole_ghost`, `skin_memory_aurora`,
`skin_dodge_onyx`, `skin_runner_ember`.
Equipment: `equip_snake_golden`, `equip_pong_titan`, `equip_mole_extra`, `equip_mole_golden`,
`equip_dodge_shield`, `equip_runner_magnet`, `equip_memory_peek`, `equip_2048_headstart`,
`equip_ttt_coach`.
BGM: `bgm_neon_lounge`, `bgm_midnight_synth`, `bgm_ocean_drift`.
Assets: `asset_stamp_neon`, `asset_stamp_gold`.
`STARTING_COINS=25`, `MAX_COINS=500000`; purchase has an in-flight lock and refunds on
storage failure; equipping BGM auto-switches the audio theme.

### 24.6 Key file line-count reference (snapshot)
```
src/pages/Arcade.jsx                 1096
src/pages/AdminDashboard.jsx         1163
src/pages/Playground.jsx              952
src/pages/ArticlePage.jsx             577
src/pages/ProjectPage.jsx             382
src/pages/Login.jsx                   322
src/pages/Home.jsx                    107
src/services/arcadeService.js         929
src/services/shopService.js           563
src/services/cloudinaryService.js     238
src/services/geminiService.js         151
src/services/articleService.js        160
src/services/portfolioService.js      141
src/services/movieService.js           90
src/services/triviaService.js          73
src/services/publicApi.js              68
src/services/authService.js            45
src/styles/theme.js                   432
src/data/portfolioData.js             536
api/article.js                        171
```

---

*End of migration.md*
