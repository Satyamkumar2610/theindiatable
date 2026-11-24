/**
 * All site copy lives here. Source: docs/claude-code-prompt.md §8 and
 * docs/concept-proposal.pdf. Never invent facts: anything not supplied by the
 * client is a `TODO:` string and must not render as if it were real.
 */

export type StageId =
  | "arrival"
  | "idea"
  | "distinction"
  | "room"
  | "conversation"
  | "beyond"
  | "people"
  | "engagement";

export type Stage = {
  id: StageId;
  number: string;
  /** Short name used in the index rail / overlay. */
  name: string;
};

export type Intent = "seat" | "nominate" | "partner";

export const brand = {
  name: "The India Table",
  tagline: "A Leadership Forum",
  title: "The India Table — A Leadership Forum",
  description:
    "A curated, high-trust forum where India's most influential young leaders meet the policymakers and public leaders shaping the country today.",
  footerLine:
    "Connecting the generation shaping India's aspirations with the people shaping India's future.",
  sealRing: "THE INDIA TABLE · BY INVITATION · A LEADERSHIP FORUM · ",
  /** TODO: client to supply the public contact address. Not rendered while it starts with TODO. */
  contactEmail: "TODO: contact email",
  copyright: "The India Table",
} as const;

export const stages: readonly Stage[] = [
  { id: "arrival", number: "01", name: "The Arrival" },
  { id: "idea", number: "02", name: "The Idea" },
  { id: "distinction", number: "03", name: "The Distinction" },
  { id: "room", number: "04", name: "The Room" },
  { id: "conversation", number: "05", name: "The Conversation" },
  { id: "beyond", number: "06", name: "Beyond the Table" },
  { id: "people", number: "07", name: "The People Behind It" },
  { id: "engagement", number: "08", name: "Engagement" },
] as const;

export const eyebrow = (s: Stage) => `[ ${s.number} — ${s.name.toUpperCase()} ]`;

export const nav = {
  index: "Index",
  close: "Close",
  enquire: "Enquire",
  skip: "Skip to content",
  pages: [
    { label: "The People", href: "/people" },
    { label: "Principles", href: "/principles" },
  ],
  cta: { label: "Request an invitation", href: "/invitation" },
} as const;

export const arrival = {
  headlines: {
    A: "Behind closed doors, an open conversation.",
    B: "A seat at the table for the India of tomorrow.",
  },
  /** Which headline renders. Brief: A by default. */
  headline: "A" as "A" | "B",
  subline:
    "A curated, high-trust forum where India's most influential young leaders meet the policymakers and public leaders shaping the country today.",
  cta: { label: "Request an invitation", href: "/invitation" },
  secondary: { label: "Discover the idea", href: "#idea" },
} as const;

export const idea = {
  headline: "Two constituencies. One room.",
  manifesto:
    "The India Table puts the generation shaping India's aspirations in the same room as the people shaping India's policies, giving policymakers a direct window into the ideas and ambitions of India's emerging generation, and giving young leaders a deeper understanding of the decisions that will shape the environment in which they build.",
  pullQuote:
    "The idea is simple: put the generation shaping India's aspirations in the same room as the people shaping India's policies.",
} as const;

export const distinction = {
  headline: "Not a conference. Not a panel. A table.",
  principles: [
    {
      title: "Influence, not titles",
      body: "A carefully selected cohort of next-generation industrialists, founders, entrepreneurs, business leaders and youth-facing voices who are already building, influencing or shaping the India of tomorrow.",
    },
    {
      title: "Direct, candid conversation",
      body: "Closed-door interaction with Union Ministers, senior policymakers and eminent public leaders: substantive exchange rather than ceremonial networking.",
    },
    {
      title: "A two-way exchange",
      body: "Policymakers gain a direct window into young India's ambitions and realities; young leaders gain access to decision-makers and a deeper understanding of policy and national priorities.",
    },
    {
      title: "A network, not a guest list",
      body: "Participants stay connected across Tables, creating a cross-sector community whose relationships and conversations continue well beyond an individual gathering.",
    },
  ],
  closing: "No stages. No panels. No audience.",
} as const;

export const room = {
  headline: "The quality of the room is the point.",
  body: "Each Table brings together 20–30 exceptional young leaders who are building companies, creating jobs, driving technology, shaping culture and increasingly influencing the aspirations of India's youth, selected through a highly curated process.",
  number: { from: 20, to: 30, display: "20–30" },
  numberLabel: "participants per Table",
  /** §8 list. (§6 table lists "Founders · Industry · Policy · Public life"; §8 is the content source.) */
  segments: ["Founders", "Industry", "Finance & technology", "Culture & youth-facing voices"],
  link: { label: "How participants are selected", href: "/principles#selection" },
} as const;

export const conversation = {
  headline: "One issue. Every voice at the table.",
  cards: [
    {
      label: "One issue",
      line: "Each Table is centred on a defining national opportunity, challenge or priority.",
    },
    {
      label: "Closed-door",
      line: "An invitation-only format designed for openness, candour and substantive exchange.",
    },
    {
      label: "Senior voices",
      line: "Ministers, policymakers and eminent leaders anchoring each conversation.",
    },
    {
      label: "Conversation",
      line: "No long speeches or panels; the emphasis is on dialogue and exchange.",
    },
  ],
  /** TODO: confirm with client that the Chatham House Rule applies. */
  note: "Conversations are held under the Chatham House Rule.",
  noteConfirmed: false,
} as const;

export const beyond = {
  headline: "A bridge to young India.",
  body: "Over time, The India Table can become a structured bridge between government and India's emerging generation of influential leaders: an ongoing channel to the people who shape the aspirations, conversations and choices of millions of young Indians, and a credible network that can contribute to youth initiatives, leadership programmes, consultations and international youth leadership dialogues.",
  line: "A room India's most promising young leaders genuinely want to be in, because the people around the table matter.",
} as const;

export type Founder = {
  slug: string;
  name: string;
  oneLiner: string;
  bio: string[];
};

export const people = {
  headline: "The founding team.",
  link: { label: "Meet the founders", href: "/people" },
  /** TODO: client to supply the institutional intent paragraph for /people. */
  intent: "TODO: institutional intent paragraph",
  /** TODO: client to approve final bio wording before launch. */
  biosApproved: false,
  founders: [
    {
      slug: "sidharth-sethi",
      name: "Sidharth Sethi",
      oneLiner: "Founder & Chairperson, Oxford India Forum",
      bio: [
        "Building a boutique investment bank focused on private equity deal syndication and mergers & acquisitions, with a sectoral focus on energy transition, advanced manufacturing and AI applications.",
        "Founder and Chairperson of the Oxford India Forum, one of the world's largest India-focused university platforms. Vice-chairperson of the youth wing of the Indian Chamber of Commerce and executive committee member of the Young Leaders Council at the All India Management Association. Advisor to U.S.-based healthcare venture builder Redesign Health.",
        "Master's degree from the University of Oxford (Dean's List); studied at The Doon School, where he served as School Captain.",
      ],
    },
    {
      slug: "suneel-bishnoi",
      name: "Suneel Bishnoi",
      oneLiner: "Convener, Rajasthan Young Thinkers Forum",
      bio: [
        "A businessman based in Jodhpur. Convener of the Rajasthan Young Thinkers Forum and part of the founding team of Sapience, a boutique foreign policy think tank.",
        "Formerly an active full-time volunteer of the Rashtriya Swayamsevak Sangh.",
      ],
    },
    {
      slug: "yashowardhan-tiwari",
      name: "Yashowardhan Tiwari",
      oneLiner: "Program Manager, Office of the Vice Chancellor, Rishihood University",
      bio: [
        "B.A. LL.B. (Hons.) (2020) and LL.M. (2022, Silver Medalist, Batch Rank 2) from Jindal Global Law School, O.P. Jindal Global University, where he was a Graduate Research Immersion Program Scholar. Formerly a Research Fellow at India Foundation.",
        "Currently Program Manager, Office of the Vice Chancellor, Rishihood University, helping build the thought leadership of the Rashtram School of Public Leadership. Primarily interested in constitutional law, public policy in India and decolonial studies.",
      ],
    },
  ] satisfies Founder[],
} as const;

export const engagement = {
  headline: "The table is set.",
  body: "Participation is by invitation. If you would like to be considered, to nominate someone, or to partner with The India Table, write to us.",
  intents: [
    { intent: "seat", label: "Request a seat", href: "/invitation?intent=seat" },
    { intent: "nominate", label: "Nominate someone", href: "/invitation?intent=nominate" },
    { intent: "partner", label: "Institutional partnership", href: "/invitation?intent=partner" },
  ] satisfies { intent: Intent; label: string; href: string }[],
  cta: { label: "Request an invitation", href: "/invitation" },
} as const;

export const principlesPage = {
  /** TODO: client to supply how participants are selected. */
  selection: "TODO: how participants are selected",
  /** TODO: client to confirm Chatham House Rule, privacy and conduct copy. */
  chathamHouse: "TODO: Chatham House Rule explanation",
  privacy: "TODO: privacy note",
  conduct: "TODO: conduct note",
} as const;

export const invitation = {
  confirmation:
    "Thank you. Every request is read by the founding team. We will write to you personally.",
} as const;

export const footer = {
  links: [
    { label: "Principles", href: "/principles" },
    /** TODO: privacy page not in the brief's page list; links to the privacy section of /principles. */
    { label: "Privacy", href: "/principles#privacy" },
  ],
} as const;

export const notFound = {
  line: "This room doesn't exist.",
  link: { label: "Return to the table", href: "/" },
} as const;

/** True when a content value is an unfilled TODO and must not render as real copy. */
export const isTodo = (v: string) => v.startsWith("TODO");
