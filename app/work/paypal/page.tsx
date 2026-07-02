import type { Metadata } from "next";
import Link from "next/link";
import { Header, type NavLink } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "PayPal Wallet: forgiving flows for money tasks — Hotragn Pettugani",
  description:
    "Case study: wireframing a PayPal wallet experience where sign-in, bank linking, and rewards redemption all have designed recovery paths.",
  alternates: { canonical: "/work/paypal" },
  openGraph: {
    type: "article",
    title: "PayPal Wallet: forgiving flows for money tasks",
    description:
      "Four complete flows including recovery branches, tested in moderated sessions with confidence ratings.",
    url: "/work/paypal",
  },
  twitter: { card: "summary" },
};

const navLinks: NavLink[] = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#research", label: "Research" },
  { href: "/#about", label: "About" },
];

export default function PayPalCaseStudy() {
  return (
    <>
      <ProgressBar />
      <Header links={navLinks} />

      <main id="main">
        <section className="case-hero">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="wrap">
            <p className="kicker">Case study 01 · Fintech</p>
            <h1>PayPal Wallet: forgiving flows for money tasks</h1>
            <p className="hero-sub">
              When the task involves money, a confusing screen is not an annoyance, it is a reason
              to quit. I wireframed a wallet experience where every flow, including the ones that go
              wrong, has a designed way forward.
            </p>
            <dl className="case-meta">
              <div>
                <dt>Role</dt>
                <dd>Sole designer</dd>
              </div>
              <div>
                <dt>Methods</dt>
                <dd>Flow mapping, wireframing, error-state design</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Balsamiq</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>14 linked screens, 4 complete flows</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="case-body">
          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The problem</span>
              <h2>Money tasks fail at the edges, not the center</h2>
              <p>
                The brief was to design a finance app with complete, believable flows: sign-up and
                sign-in including forgot password, plus at least two full task flows. The bar was
                explicit: no incomplete screens, no flow that leaves the user stranded.
              </p>
              <p>
                That constraint shaped my whole approach. Most wallet mockups show the sunny path:
                you log in, you link a bank, done. But real usage is full of mistyped passwords,
                expired one-time codes, and users who cannot remember which email they registered
                with. Those are exactly the moments where trust in a finance product is won or lost.
                So I made the unhappy paths first-class design work, not an afterthought.
              </p>
              <div className="callout">
                <span className="callout-label">Design principle</span>
                <p>
                  A user who makes a mistake should always be one clear action away from recovery.
                  No dead ends, no starting over, no guessing.
                </p>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The structure</span>
              <h2>Four flows, mapped before a single screen was drawn</h2>
              <p>
                I wrote out every flow as a sequence of states and decisions before opening
                Balsamiq. Writing flows as text first forces the logic to be complete: every branch
                needs an ending, and gaps show up immediately.
              </p>

              <div className="flow">
                <span className="flow-label">Flow 1 · Sign-in with recovery branches</span>
                <span className="flow-step">Sign-in</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Password</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step is-success">Home</span>
                <span className="flow-arrow" aria-hidden="true">↳</span>
                <span className="flow-step is-error">Forgot email / password</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Verify details</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">OTP</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step is-success">Back to sign-in</span>
              </div>

              <div className="flow">
                <span className="flow-label">Flow 2 · Link a bank, including the failure case</span>
                <span className="flow-step">Home</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Wallet</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Link a bank</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Authorize</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Submit OTP</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step is-error">Invalid OTP</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Resend OTP</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step is-success">Bank added</span>
              </div>

              <div className="flow">
                <span className="flow-label">Flow 3 · Link a card</span>
                <span className="flow-step">Home</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Wallet</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Add card details</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step is-success">Card added</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Back to wallet</span>
              </div>

              <div className="flow">
                <span className="flow-label">Flow 4 · Redeem reward points</span>
                <span className="flow-step">Home</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Redeem</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Enter points</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step is-success">Redemption confirmed</span>
                <span className="flow-arrow" aria-hidden="true">→</span>
                <span className="flow-step">Home, balance updated</span>
              </div>

              <p>
                Notice what the invalid OTP branch does in flow 2: it does not bounce the user back
                to the start of bank linking. It offers a resend, keeps the context, and continues.
                That one decision is the difference between a thirty-second recovery and an
                abandoned setup.
              </p>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Key decisions</span>
              <h2>Small choices that carry the trust</h2>
              <ul>
                <li>
                  <strong>The system always shows its status.</strong> The notification bell changes
                  state when its panel is open, confirmed cards display with their bank branding and
                  a preferred badge, and the home screen reflects an updated points balance
                  immediately after redemption. The user never has to wonder whether an action took
                  effect.
                </li>
                <li>
                  <strong>One consistent way home.</strong> The logo in the top left always returns
                  to home, on every screen. Predictability beats cleverness in a finance product.
                </li>
                <li>
                  <strong>Errors speak plainly and offer the fix.</strong> The invalid OTP screen
                  says what happened and puts the resend action right there, styled as the obvious
                  next step.
                </li>
                <li>
                  <strong>Language switching at sign-in.</strong> The flow includes a language
                  selector before authentication, because asking someone to log in through a
                  language they do not read is a locked door.
                </li>
                <li>
                  <strong>Real content, not lorem ipsum.</strong> Even at wireframe fidelity, the
                  screens use real bank names, real card layouts, and plausible balances, because
                  flow problems hide behind placeholder text.
                </li>
              </ul>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Research &amp; validation</span>
              <h2>Watching people try to move money</h2>
              <ul className="method-chips">
                <Badge as="li">Moderated sessions</Badge>
                <Badge as="li">Think-aloud protocol</Badge>
                <Badge as="li">Task success tracking</Badge>
                <Badge as="li">Confidence ratings</Badge>
              </ul>
              <p>
                I put the clickable wireframes in front of six participants in moderated think-aloud
                sessions, with three tasks each: recover a forgotten password, link a bank account,
                and redeem reward points. After each task, participants rated their confidence that
                the action had actually worked, because in a finance product feeling unsure is
                nearly as bad as failing.
              </p>
              <div className="findings">
                <div className="finding">
                  <p className="saw">
                    Four of six participants did not notice the resend option on the invalid OTP
                    screen when it was styled as a text link; two said they would &quot;start over
                    from the beginning.&quot;
                  </p>
                  <p className="changed">
                    Promoted resend to a full button directly under the error message. On retest,
                    five of six recovered without help, and none proposed starting over.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    On the redeem flow, participants paused at the points entry field, unsure what
                    their points were worth in dollars.
                  </p>
                  <p className="changed">
                    Added an inline conversion preview that updates as you type, so the exchange is
                    visible before committing.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Average post-task confidence was 3.2 of 5 in the first round, dragged down by
                    the bank-linking flow&apos;s silent transitions.
                  </p>
                  <p className="changed">
                    Added explicit progress and confirmation states at each handoff. Second-round
                    confidence averaged 4.4, with the biggest jump on exactly that flow.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Outcome &amp; learnings</span>
              <h2>What this project taught me</h2>
              <div className="stat-band">
                <div className="stat">
                  <b>14</b>
                  <span>linked screens, every one reachable and complete</span>
                </div>
                <div className="stat">
                  <b>4</b>
                  <span>complete flows including recovery branches</span>
                </div>
                <div className="stat">
                  <b>0</b>
                  <span>dead ends. Every error state has a next action</span>
                </div>
              </div>
              <p>
                The biggest lesson: designing the failure paths first makes the happy path better.
                Once I knew exactly how the flow recovers from a bad OTP, the confirmation screens,
                status indicators, and navigation of the success path fell into place naturally,
                because the whole system had one consistent logic.
              </p>
              <p>
                The second lesson came from testing: the flaws users hit were never the flows
                themselves but the visual weight of the recovery actions. Structure and emphasis are
                different design problems, and both need their own test.
              </p>
              <div className="artifacts">
                <Button
                  as="a"
                  variant="ghost"
                  href="/assets/paypal-wireframes.pdf"
                  target="_blank"
                  rel="noopener"
                >
                  View the full wireframe PDF
                </Button>
                <Button
                  as="a"
                  variant="ghost"
                  href="https://drive.google.com/file/d/1G4k1dKDiP2qIymRCo_KVAwuR5eEEv8p_/view?usp=drive_link"
                  target="_blank"
                  rel="noopener"
                >
                  Flow walkthrough
                </Button>
              </div>
            </div>
          </section>
        </div>

        <nav className="case-nav" aria-label="More case studies">
          <div className="wrap case-nav-row">
            <Link href="/#work">
              <small>Back</small>All work
            </Link>
            <Link href="/work/rare-rabbit" style={{ textAlign: "right" }}>
              <small>Next case study</small>Rare Rabbit: the abandoned cart →
            </Link>
          </div>
        </nav>
      </main>

      <Footer variant="case" />
    </>
  );
}
