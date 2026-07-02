import type { Metadata } from "next";
import Link from "next/link";
import { Header, type NavLink } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Family Foundations: designing for the hardest conversation — Hotragn Pettugani",
  description:
    "Case study: a high-fidelity mobile app for families navigating adoption, with an AI-powered Q&A, designed and usability-tested end to end.",
  alternates: { canonical: "/work/family-foundations" },
  openGraph: {
    type: "article",
    title: "Family Foundations: designing for the hardest conversation",
    description:
      "A playable hi-fi prototype for a sensitive domain, validated in two rounds of moderated usability testing.",
    url: "/work/family-foundations",
  },
  twitter: { card: "summary" },
};

const navLinks: NavLink[] = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#process", label: "Process" },
  { href: "/#writing", label: "Writing" },
  { href: "/#about", label: "About" },
];

export default function FamilyFoundationsCaseStudy() {
  return (
    <>
      <ProgressBar />
      <Header links={navLinks} />

      <main id="main">
        <section className="case-hero">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="wrap">
            <p className="kicker">Case study 04 · Social impact</p>
            <h1>Family Foundations: designing for the hardest conversation</h1>
            <p className="hero-sub">
              An app for families navigating adoption. The users are hopeful, anxious, and afraid of
              asking the wrong question out loud. Every design decision had to earn trust before it
              earned taps, and the whole flow was tested with users before it was called done.
            </p>
            <dl className="case-meta">
              <div>
                <dt>Role</dt>
                <dd>End-to-end designer</dd>
              </div>
              <div>
                <dt>Methods</dt>
                <dd>Interviews, personas, hi-fi prototyping, usability testing</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Figma</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>Nov — Dec 2024</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="case-body">
          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Try it first</span>
              <h2>The prototype, playable</h2>
              <p>
                Judge the polish yourself before reading a word of justification. Start at the
                welcome screen; the happy path runs from preferences through search to the AI
                Q&amp;A.
              </p>
              <div className="embed-frame">
                <iframe
                  src="https://embed.figma.com/proto/IYrpX6zsniSgYqQOr8DJkG/Family-Foundations?node-id=2-1417&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A1283&embed-host=share"
                  title="Family Foundations interactive prototype"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="embed-caption">
                Interactive Figma prototype, embedded live. Prefer a bigger canvas?{" "}
                <a
                  href="https://www.figma.com/proto/IYrpX6zsniSgYqQOr8DJkG/Family-Foundations?node-id=2-1417&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A1283"
                  target="_blank"
                  rel="noopener"
                >
                  Open it full screen
                </a>{" "}
                or inspect the{" "}
                <a
                  href="https://www.figma.com/design/IYrpX6zsniSgYqQOr8DJkG/Family-Foundations?node-id=0-1"
                  target="_blank"
                  rel="noopener"
                >
                  full design file
                </a>
                , layers and all.
              </p>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The problem</span>
              <h2>Adoption information is everywhere. Reassurance is nowhere.</h2>
              <p>
                People exploring adoption face a maze of agencies, eligibility rules, and paperwork,
                and the resources that exist read like legal documents. Worse, the questions that
                actually keep people up at night (&quot;are we too old,&quot; &quot;what if we
                change our minds,&quot; &quot;how do we afford this&quot;) feel too raw to ask a
                caseworker on a first call.
              </p>
              <p>
                Early conversations with people who had explored adoption, plus a review of agency
                sites and forums where these families actually gather, shaped two design targets:
                make searching feel like browsing toward a family rather than filtering a database,
                and give people a private place to ask the scary questions.
              </p>
              <div className="callout">
                <span className="callout-label">Design principle</span>
                <p>
                  In a high-emotion domain, the interface must never make the user feel processed.
                  Warmth is not decoration here; it is function.
                </p>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Key decisions</span>
              <h2>Warmth you can defend in a design review</h2>
              <ul>
                <li>
                  <strong>Preferences read as sentences, not filters.</strong> Age and location
                  selection is phrased the way people think (&quot;we&apos;re hoping to welcome a
                  child between…&quot;), which came straight from how interviewees described their
                  search out loud.
                </li>
                <li>
                  <strong>The AI Q&amp;A is private by design and says so.</strong> The input screen
                  states that questions are not stored on a profile. That single line addressed the
                  hesitation every early tester voiced before typing.
                </li>
                <li>
                  <strong>Photography over iconography for people, icons for process.</strong>{" "}
                  Children and families are shown with warm imagery; paperwork steps get calm,
                  neutral icons. Mixing those registers felt wrong in testing, so they stay
                  separated.
                </li>
                <li>
                  <strong>One action per screen on the emotional path.</strong> Search results allow
                  browsing; profile and next-step screens ask for exactly one decision at a time,
                  because testers under emotional load missed secondary actions entirely.
                </li>
              </ul>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Research &amp; validation</span>
              <h2>Tested before it was called finished</h2>
              <ul className="method-chips">
                <Badge as="li">Moderated usability sessions</Badge>
                <Badge as="li">Think-aloud protocol</Badge>
                <Badge as="li">Task success &amp; error tracking</Badge>
                <Badge as="li">Two rounds, iterate between</Badge>
              </ul>
              <p>
                I ran moderated think-aloud sessions on the prototype in two rounds, five
                participants each, with three tasks: set search preferences, find and save a
                profile, and get an answer through the Q&amp;A. Round one surfaced real problems;
                round two verified the fixes.
              </p>
              <div className="findings">
                <div className="finding">
                  <p className="saw">
                    Round one: three of five participants stalled on the preferences screen, unsure
                    whether choices could be changed later, and two said they felt &quot;locked
                    in.&quot;
                  </p>
                  <p className="changed">
                    Added a persistent &quot;you can update this anytime&quot; note and an edit path
                    from search results. In round two, nobody stalled and no one mentioned
                    commitment anxiety.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Every round-one participant hesitated before typing into the AI Q&amp;A; two
                    asked out loud who could see their question.
                  </p>
                  <p className="changed">
                    Wrote the privacy line directly above the input and moved the Q&amp;A entry
                    point off the profile page. Round two: all five typed a question without
                    prompting.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Participants trusted the AI&apos;s answers but wanted to know where they came
                    from before acting on anything.
                  </p>
                  <p className="changed">
                    Each answer now carries a plain-language source line and a &quot;talk to a
                    person about this&quot; handoff, so the AI de-escalates to humans instead of
                    replacing them.
                  </p>
                </div>
              </div>
              <p>
                Task completion went from 9 of 15 tasks in round one to 14 of 15 in round two. The
                one remaining failure was a discoverability issue on saved profiles, documented as
                the first item for a next iteration.
              </p>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Learnings</span>
              <h2>What this project taught me</h2>
              <p>
                Emotional-domain design punishes cleverness. Every place the interface tried to be
                efficient (dense filters, combined actions), testers read it as coldness; every
                place it slowed down and spoke like a person, trust went up. I now treat tone as a
                testable design variable, not copywriting polish.
              </p>
              <p>
                It also sharpened how I think about AI in interfaces: the Q&amp;A only worked once
                it disclosed its privacy behavior, cited its sources, and offered a human handoff.
                Those three patterns travel to any product that puts an AI between a person and a
                high-stakes decision.
              </p>
            </div>
          </section>
        </div>

        <nav className="case-nav" aria-label="More case studies">
          <div className="wrap case-nav-row">
            <Link href="/work/notion">
              <small>Previous</small>← Notion
            </Link>
            <Link href="/#contact" style={{ textAlign: "right" }}>
              <small>Seen enough?</small>Let&apos;s talk →
            </Link>
          </div>
        </nav>
      </main>

      <Footer variant="case" />
    </>
  );
}
