/**
 * The seam between two stages. Two inert layers, animated by SectionSeams:
 * - SeamLine: the 1px gold hairline at a stage's top edge. It draws outward from
 *   the centre as the stage rises into view (full width without motion).
 * - SeamVeil: a near-black layer over the stage that is leaving. It deepens as
 *   the next stage arrives, so the room dims as you move on.
 */
export function SeamLine() {
  return <span className="seam-line" aria-hidden="true" />;
}

export function SeamVeil() {
  return <span className="seam-veil" aria-hidden="true" />;
}
