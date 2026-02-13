# Technical Architecture

- Frontend: Next.js (App Router) + TypeScript — single-page client-side execution.
- Styling: TailwindCSS for utility-first responsive styling; dark premium theme.
- Animations: Framer Motion for micro-interactions.
- Charts: Recharts for breakdown and visualizations.
- Core engine: `lib/score.ts` — modular, testable, and entirely client-side.
- No backend or persistence — ideal for privacy-focused SaaS landing page / calculator.
