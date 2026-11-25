"use server";

import { Resend } from "resend";
import { engagement } from "@/content/site";
import { toValues, validateAll, type FieldErrors } from "@/lib/invitation";

export type SendResult =
  | { ok: true; sent: boolean }
  | { ok: false; reason: "invalid"; errors: FieldErrors }
  | { ok: false; reason: "unavailable" | "failed" };

/**
 * Sends an invitation request to the founding team.
 * Needs RESEND_API_KEY, INVITATION_TO (the team's inbox) and INVITATION_FROM
 * (a sender on a domain verified in Resend). Without them, production refuses
 * the request plainly; development logs it and says nothing was sent.
 */
export async function sendInvitationRequest(input: unknown): Promise<SendResult> {
  const v = toValues(input);
  const errors = validateAll(v);
  if (Object.keys(errors).length) return { ok: false, reason: "invalid", errors };

  // A filled honeypot is a bot: answer as if sent, send nothing.
  if (v.website) return { ok: true, sent: false };

  const intentLabel = engagement.intents.find((i) => i.intent === v.intent)?.label ?? v.intent;
  const lines = [
    `Request: ${intentLabel}`,
    "",
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `Organisation: ${v.organisation}`,
    `Role: ${v.role}`,
    v.linkedin && `LinkedIn: ${v.linkedin}`,
    v.intent === "nominate" && "",
    v.intent === "nominate" && `Nominee: ${v.nomineeName}, ${v.nomineeRole}, ${v.nomineeOrganisation}`,
    "",
    v.note,
  ].filter((l): l is string => typeof l === "string");

  const { RESEND_API_KEY: key, INVITATION_TO: to, INVITATION_FROM: from } = process.env;
  if (!key || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[invitation] Not sent: set RESEND_API_KEY, INVITATION_TO and INVITATION_FROM.\n" + lines.join("\n"));
      return { ok: true, sent: false };
    }
    return { ok: false, reason: "unavailable" };
  }

  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to,
      replyTo: v.email,
      subject: `${intentLabel}: ${v.name}, ${v.organisation}`,
      text: lines.join("\n"),
    });
    if (error) {
      console.error("[invitation] Resend refused the request:", error.message);
      return { ok: false, reason: "failed" };
    }
    return { ok: true, sent: true };
  } catch (err) {
    console.error("[invitation] Send failed:", err);
    return { ok: false, reason: "failed" };
  }
}
