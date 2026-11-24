# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Pinned by the client brief (`docs/claude-code-prompt.md` §2): Next.js App Router, TypeScript strict, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) via `useGSAP`, Lenis, a curated list of React Bits components, zod + react-hook-form, Server Actions + Resend, pnpm. Deploy target: Vercel.

## Users

Primary: an industrialist, founder, senior business leader, policymaker, or someone in their office, opening a link that was forwarded to them on WhatsApp or by email, most often on an iPhone. Their job is to judge within seconds whether this room is credible and worth being in, and then to act: request a seat, nominate someone, or propose an institutional partnership.

## Product Purpose

The India Table is a curated, invitation-only, closed-door leadership forum. Each Table puts 20–30 of India's next-generation industrialists, founders, business leaders and youth-facing voices in one room with Union Ministers, senior policymakers and eminent public leaders, around one defining national issue. The site exists to make that room legible and desirable to the people it wants in it, and to route serious interest into a personal, read-by-the-founders enquiry. Success: the right people ask to be considered, nominate others, or approach as institutional partners.

## Positioning

The quality of the room is the point. Not a conference, not a panel, not an audience: a table. A two-way exchange (policymakers see young India's ambitions; young leaders understand policy) and a network that persists across Tables. Discretion is the hook: the site never reveals names, dates, venues or guest lists.

## Operating Context

Visitors arrive cold from a forwarded link, often mid-day on a phone, sometimes from an executive assistant screening on a laptop. The forwarded link preview (OG card) is the very first impression. Enquiries are read personally by the founding team; there is no self-serve registration, ticketing or pricing.

## Capabilities and Constraints

- Pages: home narrative (8 stages), `/people`, `/principles`, `/invitation` (3-step enquiry: seat / nominate / partnership).
- Enquiry by Server Action with honeypot and rate limit; acknowledgement email to the submitter.
- Never invent facts: dates, venues, speakers, participants, past Tables, statistics, partners, testimonials. Missing copy is a marked `TODO:` in `content/site.ts`.
- Undecided: contact email; whether Chatham House Rule applies (to confirm with client); participant selection process copy; institutional intent paragraph for `/people`; final approval of founder bios.
- Budgets: LCP < 2.0s on 4G mobile, CLS < 0.05, home JS < 180KB gzip, Lighthouse ≥ 95 in all categories (mobile).

## Brand Commitments

- Name: The India Table — A Leadership Forum.
- Final brand assets in `public/brand/` (lockup, monogram, wordmark, traced from the client's logo). Letterforms must not be redrawn. The monogram is T–I–T, where the central I is a human figure with a round head and raised arms: a person rising at the table.
- Client-specified palette and faces in `CLAUDE.md` / brief §3 and §5.
- Politically neutral visual language: no saffron, no tricolour, no national emblem, no map of India.
- Voice: institutional restraint, editorial calm; never event-marketing.

## Evidence on Hand

- `docs/concept-proposal.pdf`: the concept note (source of all positioning copy).
- `docs/founding-team.pdf`: founding team bios (Sidharth Sethi, Suneel Bishnoi, Yashowardhan Tiwari).
- `docs/brand-preview.png`, `public/brand/*`: logo kit; foil lockup for OG/print only.
- Absent and not to be fabricated: past Tables, participant or guest names, dates, venues, partners, testimonials, statistics beyond "20–30 participants per Table", portraits.

## Product Principles

1. Discretion over disclosure: the absence of names is itself the signal of seriousness.
2. The room, not the event: everything points to who is at the table and how they talk, never to logistics.
3. One idea at a time: each moment carries a single thought, stated with confidence.
4. Personal, not procedural: every action reads as writing to people, not filling in a registration.
5. Truth only: no claim the client has not supplied.

## Accessibility & Inclusion

WCAG 2.1 AA minimum on every text/background pair; full `prefers-reduced-motion` support (no smooth scroll, pins or scrub; static fallbacks); keyboard-complete navigation with visible focus; semantic landmarks. Mobile-first at 375px.
