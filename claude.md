# Project Context

This is a marketing website template for B2B regtech and compliance SaaS companies.
Built with Astro 6 + Tailwind CSS v4 + TypeScript + shadcn/ui.

## Stack

- Astro 6 (static site generation)
- Tailwind CSS v4 (configured via `@tailwindcss/vite`, no `tailwind.config.*` file — theme tokens live in `src/styles/global.css`)
- TypeScript (strict mode)
- shadcn/ui as the component library (Radix primitives, Nova preset, Lucide icons)
  - Components live in `src/components/ui/` (do not edit by hand unless intentional)
  - Add new ones with `npx shadcn@latest add <name>`
  - React integration is `@astrojs/react`; render shadcn components as Astro islands. **Do not add `client:*` directives unless the component needs interactivity** — stateless primitives (Button, Card, Badge, Input) should render server-side with zero client JS to keep the perf bar.
- Node: pinned to v22 via `.nvmrc` (Astro 6 requires ≥22.12)
- Deployment target: Vercel
- CMS: pure static for v1, Astro Content Collections for the Resources section if/when needed

## Conventions

- Use Astro components (.astro) for pages, layouts, and section composition
- Use shadcn/ui primitives (Button, Card, Badge, Input, etc.) for atoms inside sections
- Use TypeScript for any utility functions; the `@/*` alias maps to `src/*`
- Page sections (Hero, Features, CTA, etc.) live in `src/components/sections/`
- Layouts live in `src/layouts/`
- Use semantic HTML — proper heading hierarchy, landmark elements
- All images must have alt text
- Color palette and typography are defined as CSS variables in `src/styles/global.css` (Tailwind v4 `@theme`) — do not hardcode colors or fonts

## Design Principles

- Sites should feel premium, not generic
- Avoid overused 2024-era patterns: gradient hero backgrounds, three-column feature cards
  with identical icons, generic testimonial carousels
- Typography hierarchy should be confident — large headlines, generous whitespace
- Performance is a feature: lazy-load images, minimize JS, target Lighthouse 95+
- Mobile-first responsive design
- Accessibility is non-negotiable: WCAG AA minimum

## Voice and Content

- This is a regtech audience: compliance officers, risk managers, CCOs
- Tone is confident and specific, never hype-driven
- Avoid AI-generated marketing clichés ("revolutionize," "unlock," "leverage cutting-edge")
- Specificity beats abstraction — name regulations (SR 11-7, DORA, GDPR) when relevant
- Buyers in this space are risk-averse and skeptical — earn trust with precision

## Workflow

- Always run `npm run build` before considering work complete
- Check Lighthouse scores in dev: aim for 95+ across all categories
- Before committing: run `npm run astro check` for TypeScript errors
- Commit messages: conventional commits format (feat:, fix:, refactor:, etc.)

## Things to ask before assuming

- Brand colors and typography (don't pick arbitrarily)
- Specific page content (don't write Lorem Ipsum or fictional stats)
- Whether to add a CMS or use static content
- Deployment target (Vercel, Netlify, Cloudflare Pages)