import { z } from "zod";
import { invitationForm as copy, type Intent } from "@/content/site";

/**
 * The invitation request, validated step by step in the browser and as a
 * whole on the server. One source of rules and messages for both.
 */
export const INTENTS = ["seat", "nominate", "partner"] as const satisfies readonly Intent[];
export type StepId = (typeof copy.steps)[number]["id"];

export type InvitationValues = {
  intent: Intent | "";
  name: string;
  email: string;
  organisation: string;
  role: string;
  linkedin: string;
  nomineeName: string;
  nomineeOrganisation: string;
  nomineeRole: string;
  note: string;
  consent: boolean;
  /** Honeypot: hidden from people, filled only by bots. */
  website: string;
};

export const emptyValues: InvitationValues = {
  intent: "",
  name: "",
  email: "",
  organisation: "",
  role: "",
  linkedin: "",
  nomineeName: "",
  nomineeOrganisation: "",
  nomineeRole: "",
  note: "",
  consent: false,
  website: "",
};

const e = copy.errors;
const line = (msg: string) => z.string().trim().min(1, msg).max(160, e.tooLong);

const stepSchemas = {
  intent: () => z.object({ intent: z.enum(INTENTS, { error: e.intent }) }),
  you: () =>
    z.object({
      name: line(e.name),
      email: z.string().trim().pipe(z.email({ error: e.email })),
      organisation: line(e.organisation),
      role: line(e.role),
      linkedin: z.union([z.literal(""), z.string().trim().pipe(z.url({ protocol: /^https$/, error: e.linkedin }))]),
    }),
  note: (intent: InvitationValues["intent"]) =>
    z.object({
      note: z.string().trim().min(1, e.note).max(2000, e.tooLong),
      ...(intent === "nominate"
        ? { nomineeName: line(e.nomineeName), nomineeOrganisation: line(e.nomineeOrganisation), nomineeRole: line(e.nomineeRole) }
        : {}),
    }),
  review: () => z.object({ consent: z.literal(true, { error: e.consent }) }),
} satisfies Record<StepId, (intent: InvitationValues["intent"]) => z.ZodType>;

export type FieldErrors = Partial<Record<keyof InvitationValues, string>>;

/** Which step each field is asked on, to send the visitor back to the first problem. */
export const fieldStep: Partial<Record<keyof InvitationValues, StepId>> = {
  intent: "intent",
  name: "you",
  email: "you",
  organisation: "you",
  role: "you",
  linkedin: "you",
  nomineeName: "note",
  nomineeOrganisation: "note",
  nomineeRole: "note",
  note: "note",
  consent: "review",
};

/** Validate one step. Returns the first message for each field that fails. */
export function validateStep(step: StepId, values: InvitationValues): FieldErrors {
  const result = stepSchemas[step](values.intent).safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof InvitationValues;
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Validate the whole request (server). */
export function validateAll(values: InvitationValues): FieldErrors {
  return copy.steps.reduce<FieldErrors>((acc, s) => ({ ...validateStep(s.id, values), ...acc }), {});
}

/** Coerce untrusted input (a Server Action argument) into the form's shape. */
export function toValues(input: unknown): InvitationValues {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (k: keyof InvitationValues) => (typeof src[k] === "string" ? (src[k] as string).slice(0, 4000) : "");
  return {
    intent: (INTENTS as readonly string[]).includes(str("intent")) ? (str("intent") as Intent) : "",
    name: str("name"),
    email: str("email"),
    organisation: str("organisation"),
    role: str("role"),
    linkedin: str("linkedin"),
    nomineeName: str("nomineeName"),
    nomineeOrganisation: str("nomineeOrganisation"),
    nomineeRole: str("nomineeRole"),
    note: str("note"),
    consent: src.consent === true,
    website: str("website"),
  };
}
