# The India Table — project memory

Marketing site for The India Table, a curated, invitation-only, closed-door leadership forum connecting India's established industrialists, business leaders and investors with Union Ministers, senior policymakers and public leaders. Audience: elite (industrialists, founders, policymakers and their offices). Full build brief: `docs/claude-code-prompt.md`. Source material: `docs/*.pdf`.

## Feel
Apple-level control + Ditchley institutional restraint + Stripe Press editorial calm. Not a conference site. One idea per screen, huge serif type, scroll-driven slow motion, one hook per section. Discretion is the hook: never reveal names, dates or guest lists.

## Hard rules
- Never invent facts (dates, venues, speakers, participants, stats, partners, testimonials). Missing copy → `TODO:` in `content/site.ts`.
- All copy lives in `content/site.ts`.
- Tokens only. No raw hex in components. Dark theme throughout.
- Gold ≤ 8% of any screen; gold text < 18px uses gold-light. Gold may carry a restrained brushed-metal sheen (the `metal-gold` treatment) on the monogram, seal and CTA only (client steer, 2026-11-24); never glows, foil textures or shadows.
- Exactly one filled button style site-wide: gold "Request an invitation". Everything else: text link with gold underline.
- Green ↔ black section switches always get a 1px gold hairline.
- No lattice, jaali or other patterned "prints" (client steer, 2026-11-24: read as cliché). Surfaces stay clean.
- `prefers-reduced-motion` → no Lenis, no pins, no scrub, full-opacity text, static fallbacks.
- No saffron, tricolour, national emblem or map of India.
- Brand SVGs in `public/brand/` are final. Do not redraw letterforms.

## Tokens
primary #0A2E22 · primary-raised #0F4535 · secondary #0B0F0D · text #FAF8F3 · text-soft #B9C4BE · gold #C9A45C · gold-light #E3C98F · hairline rgb(201 164 92 / .32) · input #FFFFFF

## Type
Display: Libre Caslon Display. Labels: Montserrat 500 uppercase, tracking .28em. Body: Hanken Grotesk 400, 17–18px / 1.7.

## Stack
Next.js App Router · TS strict · Tailwind v4 · GSAP + ScrollTrigger + SplitText via `useGSAP` · Lenis (`lenis/react`, driven by gsap.ticker, syncTouch false) · React Bits (curated list in the brief only) · zod + react-hook-form · Server Actions + Resend · pnpm.

## React Bits allowed
Staggered Menu, Circular Text, Split Text, Silk, Scroll Reveal, Spotlight Card, Masked Heading, Count Up, Scroll Stack, Tilted Card (≤3°), Magnet (low), Stepper, Fade Content, Gradual Blur. Anything else needs my approval.

## Budgets
LCP < 2.0s on 4G mobile · CLS < 0.05 · home JS < 180KB gzip · Lighthouse ≥ 95 all categories (mobile).

## Workflow
Work phase by phase per the brief; stop after each phase with: files changed, how to verify, screenshots at 375/768/1440, Lighthouse scores, open TODOs. Use the impeccable skill for design passes (`/impeccable critique`, `/impeccable polish`, `/impeccable audit`) and the GSAP skills for all animation code.
