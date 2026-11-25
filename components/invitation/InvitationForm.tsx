"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { useLenis } from "lenis/react";
import { Seal } from "@/components/brand/Seal";
import { sendInvitationRequest } from "@/app/(pages)/invitation/actions";
import { engagement, invitation, invitationForm as copy } from "@/content/site";
import { emptyValues, fieldStep, INTENTS, validateStep, type FieldErrors, type InvitationValues } from "@/lib/invitation";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const STEPS = copy.steps;
const intentLabel = (i: string) => engagement.intents.find((x) => x.intent === i)?.label ?? i;

/* ---------- Fields ---------- */

function Field({
  id,
  label,
  hint,
  optional,
  error,
  reg,
  type = "text",
  autoComplete,
  multiline,
}: {
  id: keyof InvitationValues;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  reg: UseFormRegisterReturn;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: "field-input",
    ...reg,
  };
  return (
    <div className="field" data-invalid={error ? "" : undefined}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="field-optional">{copy.fields.optional}</span>}
      </label>
      {multiline ? (
        <textarea rows={5} {...common} />
      ) : (
        <input type={type} autoComplete={autoComplete} spellCheck={type === "email" ? false : undefined} {...common} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** A secondary action as a button: the site's text link with its gold underline. */
function TextButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} className="text-link label">
      {children}
    </button>
  );
}

/* ---------- The form ---------- */

/**
 * The invitation request in four steps. Desktop: the step rail on the green,
 * the step itself on a black panel; each step slides in from the direction of
 * travel. Every step is checked before moving on; the server checks it all again.
 */
export function InvitationForm() {
  const { register, control, getValues, setValue } = useForm<InvitationValues>({ defaultValues: emptyValues });
  const intent = useWatch({ control, name: "intent" });
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<"sent" | "dev" | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const direction = useRef(1);
  const moved = useRef(false);
  const lenis = useLenis();

  // Arriving from "Request a seat", "Nominate someone" or "Institutional partnership".
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("intent");
    if (q && (INTENTS as readonly string[]).includes(q)) setValue("intent", q as InvitationValues["intent"]);
  }, [setValue]);

  // Each new step slides in from the side it came from, and takes the focus.
  useEffect(() => {
    if (!moved.current) return;
    heading.current?.focus({ preventScroll: true });
    const t = top.current;
    if (t && t.getBoundingClientRect().top < 0) {
      if (lenis && !prefersReducedMotion()) lenis.scrollTo(t, { offset: -96, duration: 0.9 });
      else t.scrollIntoView({ block: "start" });
    }
    if (!panel.current || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      panel.current.querySelectorAll(".step-in"),
      // Opacity, never visibility: a hidden heading would drop the focus it was just given.
      { opacity: 0, x: 28 * direction.current },
      { opacity: 1, x: 0, duration: 0.75, ease: "expo.out", stagger: 0.05 },
    );
    return () => {
      tween.kill();
    };
  }, [step, result, lenis]);

  const go = (to: number) => {
    direction.current = to >= step ? 1 : -1;
    moved.current = true;
    setSendError(null);
    setStep(to);
    setReached((r) => Math.max(r, to));
  };

  const next = () => {
    const found = validateStep(STEPS[step].id, getValues());
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(first === "intent" ? "intent-seat" : first)?.focus();
      return;
    }
    go(step + 1);
  };

  const send = () => {
    const found = validateStep("review", getValues());
    setErrors(found);
    if (Object.keys(found).length) return;
    setSendError(null);
    startTransition(async () => {
      const res = await sendInvitationRequest(getValues());
      if (res.ok) {
        moved.current = true;
        direction.current = 1;
        setResult(res.sent ? "sent" : "dev");
        return;
      }
      if (res.reason === "invalid") {
        setErrors(res.errors);
        const firstStep = Object.keys(res.errors).map((k) => fieldStep[k as keyof InvitationValues]).find(Boolean);
        const at = STEPS.findIndex((s) => s.id === firstStep);
        if (at >= 0 && at !== step) go(at);
        return;
      }
      setSendError(res.reason === "unavailable" ? copy.unavailable : copy.sendFailed);
    });
  };

  const values = getValues();
  const reg = (name: keyof InvitationValues) => register(name);
  const current = STEPS[step];

  return (
    <div ref={top} className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      {/* The rail: where you are, and the way back. */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <p className="label text-gold-light lg:hidden" aria-hidden="true">
            {copy.stepOf(Math.min(step + 1, STEPS.length), STEPS.length)}
          </p>
          <ol className="step-rail" aria-label={copy.title}>
            {STEPS.map((s, i) => {
              const state = result ? "done" : i === step ? "current" : i < step ? "done" : "todo";
              const canGo = !result && i !== step && i <= reached;
              return (
                <li key={s.id} className="step" data-state={state}>
                  <span className="step-seat" aria-hidden="true" />
                  {canGo ? (
                    <button type="button" className="step-label" onClick={() => go(i)}>
                      {s.label}
                    </button>
                  ) : (
                    <span className="step-label" aria-current={state === "current" ? "step" : undefined}>
                      {s.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-12 hidden max-w-[30ch] text-text-soft lg:block">{invitation.promise}</p>
        </div>
      </div>

      {/* The panel: one step at a time. */}
      <div ref={panel} className="invite-panel lg:col-span-8">
        {result ? (
          <div className="flex flex-col items-start" aria-live="polite">
            <Seal className="step-in w-24" />
            <h2 ref={heading} tabIndex={-1} className="step-in mt-10 font-display text-statement text-text outline-none">
              {invitation.confirmation.split(". ")[0]}.
            </h2>
            <p className="step-in mt-6 max-w-[44ch] text-text-soft">{invitation.promise}</p>
            {result === "dev" && <p className="step-in pending mt-8">{copy.devNotSent}</p>}
            <Link href={copy.done.href} className="step-in text-link label mt-12">
              {copy.done.label}
            </Link>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (step < STEPS.length - 1) next();
              else send();
            }}
          >
            {/* Honeypot: off-screen, out of the tab order, never announced. */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" {...reg("website")} />
            </div>

            <fieldset>
              <legend className="sr-only">{current.label}</legend>
              <p className="step-in label text-gold-light">{copy.stepOf(step + 1, STEPS.length)}</p>
              <h2 ref={heading} tabIndex={-1} className="step-in mt-6 font-display text-statement text-text outline-none">
                {current.id === "intent" && copy.intentQuestion}
                {current.id === "you" && copy.youQuestion}
                {current.id === "note" && copy.noteQuestion[intent || "seat"]}
                {current.id === "review" && copy.reviewQuestion}
              </h2>

              <div className="mt-12 lg:mt-14">
                {current.id === "intent" && (
                  <div role="radiogroup" aria-labelledby="intent-q" aria-describedby={errors.intent ? "intent-error" : undefined}>
                    <span id="intent-q" className="sr-only">
                      {copy.intentQuestion}
                    </span>
                    <div className="grid gap-px bg-hairline">
                      {engagement.intents.map((it) => (
                        <label key={it.intent} className="step-in choice">
                          <input id={`intent-${it.intent}`} type="radio" value={it.intent} className="sr-only" {...reg("intent")} />
                          <span className="choice-seat" aria-hidden="true" />
                          <span className="flex flex-col gap-2">
                            <span className="font-display text-h3 text-text">{it.label}</span>
                            <span className="text-text-soft">{copy.intentHelp[it.intent]}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.intent && (
                      <p id="intent-error" className="field-error mt-4">
                        {errors.intent}
                      </p>
                    )}
                  </div>
                )}

                {current.id === "you" && (
                  <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
                    <div className="step-in md:col-span-2">
                      <Field id="name" label={copy.fields.name} autoComplete="name" error={errors.name} reg={reg("name")} />
                    </div>
                    <div className="step-in md:col-span-2">
                      <Field id="email" type="email" label={copy.fields.email} autoComplete="email" error={errors.email} reg={reg("email")} />
                    </div>
                    <div className="step-in">
                      <Field id="organisation" label={copy.fields.organisation} autoComplete="organization" error={errors.organisation} reg={reg("organisation")} />
                    </div>
                    <div className="step-in">
                      <Field id="role" label={copy.fields.role} autoComplete="organization-title" error={errors.role} reg={reg("role")} />
                    </div>
                    <div className="step-in md:col-span-2">
                      <Field id="linkedin" type="url" label={copy.fields.linkedin} optional autoComplete="url" error={errors.linkedin} reg={reg("linkedin")} />
                    </div>
                  </div>
                )}

                {current.id === "note" && (
                  <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
                    {intent === "nominate" && (
                      <>
                        <div className="step-in md:col-span-2">
                          <Field id="nomineeName" label={copy.fields.nomineeName} error={errors.nomineeName} reg={reg("nomineeName")} />
                        </div>
                        <div className="step-in">
                          <Field id="nomineeOrganisation" label={copy.fields.nomineeOrganisation} error={errors.nomineeOrganisation} reg={reg("nomineeOrganisation")} />
                        </div>
                        <div className="step-in">
                          <Field id="nomineeRole" label={copy.fields.nomineeRole} error={errors.nomineeRole} reg={reg("nomineeRole")} />
                        </div>
                      </>
                    )}
                    <div className="step-in md:col-span-2">
                      <Field
                        id="note"
                        multiline
                        label={copy.fields.note[intent || "seat"]}
                        hint={copy.fields.noteHint}
                        error={errors.note}
                        reg={reg("note")}
                      />
                    </div>
                  </div>
                )}

                {current.id === "review" && (
                  <>
                    <dl className="step-in border-t border-hairline">
                      {[
                        { at: 0, term: STEPS[0].label, value: intentLabel(values.intent) },
                        { at: 1, term: copy.fields.name, value: values.name },
                        { at: 1, term: copy.fields.email, value: values.email },
                        { at: 1, term: copy.fields.organisation, value: values.organisation },
                        { at: 1, term: copy.fields.role, value: values.role },
                        ...(values.linkedin ? [{ at: 1, term: copy.fields.linkedin, value: values.linkedin }] : []),
                        ...(values.intent === "nominate"
                          ? [{ at: 2, term: copy.fields.nominee, value: `${values.nomineeName}, ${values.nomineeRole}, ${values.nomineeOrganisation}` }]
                          : []),
                        { at: 2, term: copy.fields.note[values.intent || "seat"], value: values.note },
                      ].map((row) => (
                        <div key={row.term} className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[11rem_1fr_auto] sm:gap-8">
                          <dt className="text-[0.95rem] text-text-soft">{row.term}</dt>
                          <dd className="min-w-0 break-words whitespace-pre-line text-text">{row.value}</dd>
                          <dd>
                            <button type="button" onClick={() => go(row.at)} className="text-link label">
                              {copy.actions.edit}
                              <span className="sr-only">: {row.term}</span>
                            </button>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="step-in mt-10">
                      <label className="consent" data-invalid={errors.consent ? "" : undefined}>
                        <input
                          type="checkbox"
                          aria-invalid={errors.consent ? true : undefined}
                          aria-describedby={errors.consent ? "consent-error" : undefined}
                          {...reg("consent")}
                        />
                        <span>{copy.fields.consent}</span>
                      </label>
                      {errors.consent && (
                        <p id="consent-error" className="field-error mt-3">
                          {errors.consent}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </fieldset>

            <div className="step-in mt-14 flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? <TextButton onClick={() => go(step - 1)}>{copy.actions.back}</TextButton> : <span />}
              {step < STEPS.length - 1 ? (
                <TextButton type="submit">{copy.actions.next}</TextButton>
              ) : (
                // The one gold action, named for what it does.
                <button type="submit" className="btn-invite" disabled={pending} aria-busy={pending}>
                  {pending ? copy.actions.sending : engagement.cta.label}
                </button>
              )}
            </div>
            <p className="mt-6 min-h-[1.7em] text-text" role="status" aria-live="polite">
              {sendError}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
