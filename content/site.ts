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
  /** AUDIENCE PIVOT (user direction, 2026-11-24): established leaders, not young leaders. Client to approve wording. */
  description:
    "A curated, high-trust forum where India's industrialists, business leaders and investors meet the policymakers and public leaders shaping the country.",
  footerLine: "Connecting the people building India's economy with the people shaping its policy.",
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
  /** Short form for the nav on phones; the full label stays as the accessible name. */
  ctaShort: "Invitation",
} as const;

export const arrival = {
  headlines: {
    /** Client to approve: replaces "Behind closed doors, an open conversation." (user direction, 2026-11-24). */
    A: "Shaping the ecosystems that shape India.",
    B: "A seat at the table for the India of tomorrow.",
  },
  /** Which headline renders. Brief: A by default. */
  headline: "A" as "A" | "B",
  /** AUDIENCE PIVOT: client to approve. */
  subline:
    "A curated, high-trust forum where India's industrialists, business leaders and investors meet the policymakers and public leaders shaping the country.",
  cta: { label: "Request an invitation", href: "/invitation" },
  secondary: { label: "Discover the idea", href: "#idea" },
  /** Interface cue on desktop, not client copy. */
  cue: "Scroll to enter",
} as const;

export const idea = {
  headline: "Two constituencies. One room.",
  /** AUDIENCE PIVOT: rewritten from the concept note's "generation" framing. Client to approve. */
  manifesto:
    "The India Table puts the people building India's enterprises in the same room as the people shaping India's policies, giving policymakers a direct window into the ambitions and realities of Indian business, and giving business leaders a deeper understanding of the decisions that will shape the environment in which they build.",
  /** Not rendered on home: it repeated the manifesto word for word (hierarchy pass, 2026-11-25). Kept for /principles or press use. */
  pullQuote:
    "The idea is simple: put the people building India's enterprises in the same room as the people shaping India's policies.",
  /** The two constituencies. Used as the two sides of the mark in 02. */
  sides: ["The people building India's enterprises", "The people shaping India's policies"],
  /** Structural credit linking to the founders (interface copy; names come from people.founders). */
  creditLabel: "Convened by the founding team",
} as const;

export const distinction = {
  headline: "Not a conference. Not a panel. A table.",
  principles: [
    {
      title: "Influence, not titles",
      /** AUDIENCE PIVOT: client to approve. */
      body: "A carefully selected cohort of industrialists, business leaders, investors and founders who are already building, financing and shaping India's economy.",
    },
    {
      title: "Direct, candid conversation",
      body: "Closed-door interaction with Union Ministers, senior policymakers and eminent public leaders: substantive exchange rather than ceremonial networking.",
    },
    {
      title: "A two-way exchange",
      /** AUDIENCE PIVOT: client to approve. */
      body: "Policymakers gain a direct window into the ambitions and realities of Indian enterprise; business leaders gain access to decision-makers and a deeper understanding of policy and national priorities.",
    },
    {
      title: "A network, not a guest list",
      body: "Participants stay connected across Tables, creating a cross-sector community whose relationships and conversations continue well beyond an individual gathering.",
    },
  ],
  /** Not rendered on home: it repeated the headline's device and cost a screen (hierarchy pass, 2026-11-25). */
  closing: "No stages. No panels. No audience.",
} as const;

export const room = {
  headline: "The quality of the room is the point.",
  /** AUDIENCE PIVOT: client to approve. */
  body: "Each Table brings together 20–30 established leaders who are building companies, creating jobs, deploying capital and driving technology, selected through a highly curated process.",
  number: { from: 20, to: 30, display: "20–30" },
  numberLabel: "participants per Table",
  /** AUDIENCE PIVOT (user's own list: industrialists, business leaders, investors). Client to approve. */
  segments: ["Industrialists", "Business leaders", "Investors", "Founders"],
  link: { label: "How participants are selected", href: "/principles#selection" },
  /** Illustrative photograph (CC0, see public/images/CREDITS.md); not an India Table gathering. */
  imageAlt: "A long conference table in a dark room, every chair drawn in, empty.",
} as const;

export const conversation = {
  headline: "One issue. Every voice at the table.",
  cards: [
    {
      label: "One issue",
      line: "Each Table is centred on a defining national opportunity, challenge or priority.",
      imageAlt: "A fountain pen mid-sentence on a ruled page.",
    },
    {
      label: "Closed-door",
      line: "An invitation-only format designed for openness, candour and substantive exchange.",
      imageAlt: "A classical hall closed to the street, lit only from a glass ceiling.",
    },
    {
      label: "Senior voices",
      line: "Ministers, policymakers and eminent leaders anchoring each conversation.",
      imageAlt: "A stone column seen from below, rising to its capital.",
    },
    {
      label: "Conversation",
      line: "No long speeches or panels; the emphasis is on dialogue and exchange.",
      imageAlt: "Chairs drawn up to a table, facing one another.",
    },
  ],
  /** TODO: confirm with client that the Chatham House Rule applies. */
  note: "Conversations are held under the Chatham House Rule.",
  noteConfirmed: false,
} as const;

export const beyond = {
  /** AUDIENCE PIVOT: rewritten from "a bridge to young India". Client to approve. */
  headline: "A lasting bridge between enterprise and government.",
  body: "Over time, The India Table can become a structured bridge between government and the leaders building India's economy: an ongoing channel to the people who create jobs, deploy capital and build industries, and a credible network that can contribute to consultations, policy dialogue and international economic exchange.",
  line: "A room India's most serious business leaders genuinely want to be in, because the people around the table matter.",
  /** Illustrative photograph (CC0, see public/images/CREDITS.md). */
  imageAlt: "A colonnade of stone arches running on into the light.",
} as const;

export type Founder = {
  slug: string;
  name: string;
  oneLiner: string;
  bio: string[];
  /** Path under /public. TODO: client to supply portraits; until then the card shows initials. */
  portrait?: string;
};

export const people = {
  headline: "The founding team.",
  link: { label: "Meet the founders", href: "/people" },
  readBio: "Read biography",
  closeBio: "Close",
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

/**
 * Questions the target reader asked that the client has not answered yet.
 * TODO: client to supply. Nothing here renders until it is real copy.
 */
export const pending = {
  houseRules: "TODO: house rules (Chatham House? no press, no photography, no sponsored speaking?)",
  cost: "TODO: is there a fee or time commitment for participants?",
  selection: "TODO: how participants are selected (nomination, review, criteria)",
  cadence: "TODO: how often Tables are convened",
  governmentSeats: "TODO: how many senior voices sit at each Table",
  afterRequest: "TODO: what happens after a request, and when",
  audiencePivot: "TODO: client to approve the copy rewritten for established leaders (marked AUDIENCE PIVOT)",
} as const;

export const principlesPage = {
  /** TODO: client to supply how participants are selected. */
  selection: "TODO: how participants are selected",
  /** TODO: client to confirm Chatham House Rule, privacy and conduct copy. */
  chathamHouse: "TODO: Chatham House Rule explanation",
  privacy: "TODO: privacy note",
  conduct: "TODO: conduct note",

  /** Interface copy for /principles. Every fact below is quoted from the sections above. */
  meta: {
    title: "Principles",
    description: "How a Table works: the principles, the format, and what holds it together.",
  },
  title: "How a Table works.",
  standfirst: room.body,
  contentsLabel: "On this page",
  chapters: {
    principles: "The principles",
    format: "The format",
    selection: "Selection",
    chathamHouse: "The Chatham House Rule",
    conduct: "Conduct",
    beyond: "Beyond the table",
    privacy: "Privacy",
  },
  /** The format as a spec sheet (concept note, "Format"). */
  format: [
    { term: room.number.display, detail: "Participants per Table, selected through a highly curated process." },
    { term: conversation.cards[1].label, detail: conversation.cards[1].line },
    { term: conversation.cards[2].label, detail: conversation.cards[2].line },
    /** AUDIENCE PIVOT: mirrors room.segments. Client to approve. */
    { term: "Around the table", detail: "Industrialists, business leaders, investors and founders." },
    { term: conversation.cards[0].label, detail: conversation.cards[0].line },
    { term: conversation.cards[3].label, detail: conversation.cards[3].line },
  ],
} as const;

export const peoplePage = {
  meta: {
    title: "The founding team",
    description: "The founding team behind The India Table.",
  },
  indexLabel: "The founders",
} as const;

export const invitation = {
  confirmation:
    "Thank you. Every request is read by the founding team. We will write to you personally.",
  /** The same promise, shown before someone writes (the confirmation copy without "Thank you."). */
  promise: "Every request is read by the founding team. We will write to you personally.",
} as const;

/** /invitation: the request form. Interface copy only; no facts. */
export const invitationForm = {
  meta: {
    title: "Request an invitation",
    description: "Participation in The India Table is by invitation. Request a seat, nominate someone, or propose an institutional partnership.",
  },
  title: "Request an invitation.",
  standfirst: engagement.body,
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  steps: [
    { id: "intent", label: "Your request" },
    { id: "you", label: "About you" },
    { id: "note", label: "Your note" },
    { id: "review", label: "Review and send" },
  ],
  intentQuestion: "What would you like to do?",
  intentHelp: {
    seat: "Be considered for a seat at a Table.",
    nominate: "Put forward someone who belongs at the table.",
    partner: "Propose a partnership on behalf of your institution.",
  },
  youQuestion: "Tell us who you are.",
  noteQuestion: {
    seat: "What would you bring to the table?",
    nominate: "Who are you nominating?",
    partner: "What does your institution have in mind?",
  },
  reviewQuestion: "Check your request before you send it.",
  fields: {
    name: "Full name",
    email: "Email",
    organisation: "Organisation",
    role: "Role",
    linkedin: "LinkedIn profile",
    optional: "Optional",
    nominee: "Nominee",
    nomineeName: "Their full name",
    nomineeOrganisation: "Their organisation",
    nomineeRole: "Their role",
    note: {
      seat: "Your note",
      nominate: "Why they belong at the table",
      partner: "Your proposal",
    },
    noteHint: "A few sentences is enough.",
    consent: "The India Table may use these details to reply to this request.",
  },
  errors: {
    intent: "Choose what you would like to do.",
    name: "Enter your full name.",
    email: "Enter an email address, like name@company.com.",
    organisation: "Enter your organisation.",
    role: "Enter your role.",
    linkedin: "Enter the full address of the profile, starting with https://",
    nomineeName: "Enter their full name.",
    nomineeOrganisation: "Enter their organisation.",
    nomineeRole: "Enter their role.",
    note: "Write a short note.",
    tooLong: "This is too long. Shorten it and try again.",
    consent: "Tick the box so we can reply to you.",
  },
  actions: {
    next: "Continue",
    back: "Back",
    edit: "Edit",
    sending: "Sending your request",
  },
  sendFailed: "Your request was not sent. Check your connection and send it again.",
  /** Shown when the site has no mail settings (RESEND_API_KEY, INVITATION_TO, INVITATION_FROM). */
  unavailable: "Requests cannot be sent from this site yet. Please try again later.",
  /** Development only: the request validated but no mail settings are present, so nothing was sent. */
  devNotSent: "Development: nothing was sent (no mail settings). The request is in the server log.",
  done: { label: "Return to the table", href: "/" },
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
