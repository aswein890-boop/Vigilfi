# VigilFi — Financial Resilience Score (Client-side)

VigilFi is a premium, no-login financial safety assessment tool that calculates a Financial Resilience Score (0–100) and estimates survival runway if income stops. All calculations run in the browser — no data leaves the user.

Quick start

1. Install dependencies: `npm install`
2. Run locally: `npm run dev` (http://localhost:3000)
3. Build for production: `npm run build` and `npm run start`

Key features

- Client-side Financial Resilience Engine (survival months + weighted score)
- Premium dark UI, animated radial gauge, responsive charts
- SEO-ready (dynamic metadata, JSON-LD FAQ, sitemap, robots)
- No login, no DB — private by design
- Detailed printable PDF report (styled, exportable)
- Unit tests covering edge-cases and component rendering
- Accessibility and Lighthouse-focused performance optimizations

Docs

- `docs/scoring.md` — scoring methodology
- `docs/architecture.md` — technical architecture
- `docs/deployment.md` — deploy to Vercel
- `docs/privacy.md` — privacy policy (no data stored)
- `docs/terms.md` — terms of use

Design & implementation

The core scoring logic is in `lib/score.ts` and is fully unit-tested. The UI is built with Next.js (App Router), TailwindCSS, Recharts, and Framer Motion. All copy and source code are original and written for this project.

SEO & content

- Landing content is optimized for search (long‑form educational copy + FAQ JSON‑LD).
- Sitemap and robots.txt included for crawlability.
- Performance and accessibility optimizations applied for Lighthouse.

License & credits

Original work for VigilFi — you may adapt and extend. No AI‑copied or plagiarized code was used.
