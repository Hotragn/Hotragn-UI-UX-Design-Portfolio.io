/**
 * "Research frameworks" section content. Three measurement frameworks
 * framed as ones the owner developed by synthesizing established HCI and
 * behavioral science. Every outcome carries a visible "Illustrative
 * benchmark" tag, and nothing claims a real measured result.
 *
 * Server component (no client state needed); rendered inside the section
 * in app/page.tsx.
 */

type Framework = {
  label: string;
  name: string;
  gap: string;
  synthesis: string[];
  formula: string;
  outcome: string;
  practice: string;
};

const frameworks: Framework[] = [
  {
    label: "AI transparency",
    name: "AI Transparency Friction Index (ATFI)",
    gap: "SUS scores ease and NPS scores loyalty, but neither captures the hidden effort a user spends deciding whether to trust an AI answer. Time-on-task cannot tell confident use apart from anxious re-verification, and the System Causability Scale only rates explanations after the fact through a survey.",
    synthesis: [
      "Explainable-AI trust calibration",
      "Cognitive Load Theory",
      "Information Foraging Theory",
    ],
    formula:
      "ATFI = 100 x (0.40 x Vn + 0.35 x Hz + 0.25 x C)\n\nVn = verification actions (source or why clicks, rationale expands) / expected\nHz = z-scored hesitation dwell before acting\nC  = correction, undo, or regenerate rate\n\nTracked purely from product analytics, per AI response.\nHigher means more friction reconciling trust.",
    outcome:
      "Adding inline citations and confidence chips projected to lower ATFI from ~46 to ~29 and cut post-answer edits ~22%.",
    practice:
      "I developed the AI Transparency Friction Index to measure what SUS and NPS miss: the hidden work of deciding whether to trust an AI output. It fuses trust-calibration research, cognitive load theory, and information foraging into one analytics-tracked score from verification clicks, hesitation dwell, and correction rate. I use it to prove whether an explainability feature actually reduces user friction, not just whether people say they like it.",
  },
  {
    label: "Spatial and dense UIs",
    name: "Cognitive Load Recovery Ratio (CLRR)",
    gap: "Time-on-task and error rate are per-task snapshots that miss fatigue building across a whole session, and the rigs that do measure it (NASA-TLX, eye tracking, HRV) cannot ship inside a normal product. Teams have no analytics-only proxy for how load accumulates and recovers.",
    synthesis: [
      "Cognitive Load Theory",
      "Attention Restoration Theory",
      "Psychomotor fatigue (Fitts degradation)",
    ],
    formula:
      "Fit a fatigue slope B across successive comparable tasks\nfrom normalized completion time and error rate.\n\nCLRR = performance recovered / rest interval after a restorative break\n\nA flatter B and a higher CLRR mean attention recovers.\nCaptured from task telemetry and timestamps,\nwith optional HRV where wearables exist.",
    outcome:
      "Chunking a 9-field spatial form into three restorative steps projected to flatten the fatigue slope ~31%.",
    practice:
      "I built the Cognitive Load Recovery Ratio because a single task can test fine while a full session quietly exhausts the user, especially in spatial and AI-dense interfaces. It combines cognitive load theory, attention restoration, and psychomotor fatigue into a slope you can read straight from analytics, no lab rig required. I use it to decide where an interface needs pacing and restorative breaks rather than more density.",
  },
  {
    label: "Personalization and privacy",
    name: "Personalization Value-to-Exposure Ratio (PVER)",
    gap: "NPS and CSAT miss the inverted-U where personalization flips from helpful to invasive. Research names the threshold, but product teams have no in-product instrument to find where their own users cross it.",
    synthesis: [
      "Privacy Calculus Theory",
      "Personalization paradox (inverted-U)",
      "Loss aversion",
    ],
    formula:
      "Across personalization-intensity tiers:\n\nPVER(t) = engagement lift(t) / exposure signals(t)\n\nexposure signals = opt-outs + privacy-setting visits\n  + why-am-I-seeing-this clicks + disclosure hesitation\n\nThe tier where PVER starts falling is that cohort's\ncomfort threshold; cap personalization there.\nRun as a tiered A/B.",
    outcome:
      "Instrumenting five tiers projected to locate the inflection at tier 3 and roughly halve opt-outs while holding engagement.",
    practice:
      "I developed the Personalization Value-to-Exposure Ratio to operationalize a threshold that research describes but rarely measures in the wild. Grounded in privacy calculus, the personalization paradox, and loss aversion, it reads the point where extra personalization starts costing more in opt-outs and privacy checks than it returns in engagement. I use it to set personalization intensity from a cohort's own behavior instead of a guess.",
  },
];

export function Frameworks() {
  return (
    <div className="frameworks-grid">
      {frameworks.map((f) => (
        <div className="tilt-wrap reveal" key={f.name}>
          <article className="fw-card tilt">
            <span className="tilt-glare" aria-hidden="true"></span>
            <p className="fw-label">{f.label}</p>
            <h3 className="fw-name">{f.name}</h3>

            <p className="fw-heading">The gap</p>
            <p className="fw-text">{f.gap}</p>

            <p className="fw-heading">The synthesis</p>
            <ul className="fw-chips">
              {f.synthesis.map((s) => (
                <li className="fw-chip" key={s}>
                  {s}
                </li>
              ))}
            </ul>

            <p className="fw-heading">How it is measured</p>
            <pre className="fw-formula">{f.formula}</pre>

            <p className="fw-outcome">
              {f.outcome} <span className="fw-illustrative">Illustrative benchmark</span>
            </p>

            <p className="fw-practice">{f.practice}</p>
          </article>
        </div>
      ))}
    </div>
  );
}
