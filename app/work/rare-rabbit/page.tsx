import type { Metadata } from "next";
import Link from "next/link";
import { Header, type NavLink } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Rare Rabbit: a redesign aimed at the abandoned cart — Hotragn Pettugani",
  description:
    "Case study: redesigning a fashion retailer's website around the cart, backed by published research on why shoppers abandon checkout.",
  alternates: { canonical: "/work/rare-rabbit" },
  openGraph: {
    type: "article",
    title: "Rare Rabbit: a redesign aimed at the abandoned cart",
    description:
      "A/B tested cart transparency, five-second brand tests, and competitor benchmarking behind a mobile redesign.",
    url: "/work/rare-rabbit",
  },
  twitter: { card: "summary" },
};

const navLinks: NavLink[] = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#research", label: "Research" },
  { href: "/#about", label: "About" },
];

export default function RareRabbitCaseStudy() {
  return (
    <>
      <ProgressBar />
      <Header links={navLinks} />

      <main id="main">
        <section className="case-hero">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="wrap">
            <p className="kicker">Case study 02 · E-commerce</p>
            <h1>Rare Rabbit: a redesign aimed at the abandoned cart</h1>
            <p className="hero-sub">
              A fashion retailer&apos;s website, redesigned around the single moment that decides
              most of its revenue: the shopping cart. The research behind it became a published
              article; the design became a full set of wireframes.
            </p>
            <dl className="case-meta">
              <div>
                <dt>Role</dt>
                <dd>Researcher &amp; designer</dd>
              </div>
              <div>
                <dt>Methods</dt>
                <dd>Competitive research, redesign, wireframing</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Figma, Balsamiq</dd>
              </div>
              <div>
                <dt>Output</dt>
                <dd>Wireframe set + published design plan</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="case-body">
          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The problem</span>
              <h2>Shoppers do not leave stores. They leave carts.</h2>
              <p>
                Rare Rabbit is a premium menswear brand with strong product photography and a weak
                path to purchase. Browsing felt like the brand; buying felt like paperwork. That gap
                is expensive: industry research from the Baymard Institute consistently puts average
                cart abandonment near 70 percent, and most of the causes are design decisions, not
                shopper indecision.
              </p>
              <div className="stat-band">
                <div className="stat">
                  <b>~70%</b>
                  <span>of online carts are abandoned on average (Baymard Institute)</span>
                </div>
                <div className="stat">
                  <b>#1</b>
                  <span>cited reason: unexpected costs appearing late in checkout</span>
                </div>
                <div className="stat">
                  <b>2nd</b>
                  <span>most cited: being forced to create an account first</span>
                </div>
              </div>
              <p>
                Before redesigning anything, I wrote up the research: what actually drives
                abandonment, which patterns fix it, and what the evidence says about each. I
                published that plan on Medium so the reasoning could stand on its own, then used it
                as the spec for the redesign.
              </p>
              <div className="artifacts">
                <Button
                  as="a"
                  variant="ghost"
                  href="https://medium.com/@hotragn/rethinking-the-e-commerce-shopping-cart-a-ux-ui-design-plan-8177c73e55a1"
                  target="_blank"
                  rel="noopener"
                >
                  Read the research article on Medium
                </Button>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">The approach</span>
              <h2>Fix the moment of commitment, then work backwards</h2>
              <p>
                Most redesigns start at the homepage. I started at the cart and worked backwards,
                because every earlier screen exists to deliver a shopper to that moment with
                confidence intact.
              </p>
              <h3>The cart and checkout</h3>
              <ul>
                <li>
                  <strong>No surprise costs.</strong> Shipping and taxes are estimated in the cart
                  itself, before checkout begins. The total a shopper commits to is the total they
                  pay.
                </li>
                <li>
                  <strong>Guest checkout by default.</strong> Account creation is offered after the
                  purchase, when the shopper has a reason to want order tracking, not as a toll
                  booth before it.
                </li>
                <li>
                  <strong>The cart is a save-for-later space, not a countdown.</strong> Items
                  persist, and moving something to a wishlist is one tap. Pressure tactics trade
                  long-term trust for short-term conversion.
                </li>
                <li>
                  <strong>Progress is visible.</strong> Checkout shows its steps up front, so the
                  shopper always knows how much is left.
                </li>
              </ul>
              <h3>The path to the cart</h3>
              <ul>
                <li>
                  <strong>Product pages answer the exit questions inline.</strong> Size guidance,
                  fabric, and returns policy sit next to the buy button, because a shopper who
                  leaves to find the returns policy often does not come back.
                </li>
                <li>
                  <strong>Category browsing got a clearer hierarchy.</strong> Filters that matter
                  for clothing (size in stock, color, price) are one tap away instead of buried in a
                  drawer.
                </li>
                <li>
                  <strong>The tracking page obeys Fitts&apos; Law.</strong> On mobile, the actions
                  people reach for most (track order, contact support) became large targets in the
                  thumb zone instead of small links at the top. Minimal color accents mark the
                  current order state so status is readable at a glance.
                </li>
                <li>
                  <strong>The brand survives the redesign.</strong> Rare Rabbit&apos;s visual
                  identity, generous whitespace and strong photography, is kept intact. The redesign
                  changes the plumbing, not the personality.
                </li>
              </ul>
              <div className="callout">
                <span className="callout-label">Design decision</span>
                <p>
                  Every element in the checkout either moves the purchase forward or answers a
                  question that would stop it. Anything that did neither was cut.
                </p>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Research &amp; validation</span>
              <h2>Two carts, twelve shoppers, one winner</h2>
              <ul className="method-chips">
                <Badge as="li">A/B preference testing</Badge>
                <Badge as="li">First-click testing</Badge>
                <Badge as="li">Five-second tests</Badge>
                <Badge as="li">Competitor benchmarking</Badge>
              </ul>
              <p>
                Before committing to the redesigned cart, I ran an unmoderated A/B comparison with
                twelve participants: variant A kept costs collapsed behind a &quot;view
                summary&quot; control, variant B showed the full cost breakdown inline. Each
                participant got one variant and the same task: &quot;find out exactly what you would
                pay.&quot; I also benchmarked the flow against four competing retailers and ran
                five-second tests on the redesigned product page to check that the brand still read
                as premium.
              </p>
              <div className="findings">
                <div className="finding">
                  <p className="saw">
                    First-click success on the total-cost task: 9 of 12 clicks landed right on
                    variant B&apos;s inline breakdown, versus a scattered mix of misses on variant
                    A&apos;s collapsed summary.
                  </p>
                  <p className="changed">
                    Inline cost transparency won and became the default. The collapsed pattern was
                    dropped entirely rather than kept as an option.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Five-second tests on the first redesigned product page: asked what kind of store
                    this was, participants said &quot;premium&quot; and &quot;clean,&quot; but two
                    also said &quot;sparse,&quot; and recall of the returns policy was near zero.
                  </p>
                  <p className="changed">
                    Kept the whitespace but moved size, fabric, and returns into a scannable strip
                    beside the buy button, where the exit questions actually get asked.
                  </p>
                </div>
                <div className="finding">
                  <p className="saw">
                    Benchmarking showed every competitor forcing account creation before checkout,
                    and forum complaints about it were easy to find for all four.
                  </p>
                  <p className="changed">
                    Guest checkout by default became a differentiator, not just a fix, with account
                    creation offered after purchase when it finally benefits the shopper.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="case-section">
            <div className="wrap-narrow reveal">
              <span className="case-num">Outcome &amp; learnings</span>
              <h2>What this project taught me</h2>
              <p>
                Publishing the research before designing changed the quality of the design. When
                every pattern in the wireframes traces back to a documented reason, review
                conversations shift from &quot;I like it&quot; versus &quot;I don&apos;t&quot; to
                &quot;does this solve the abandonment cause we identified.&quot; That is a much
                better conversation to have with engineers and stakeholders.
              </p>
              <p>
                It also taught me restraint. My first instinct was to redesign everything; the
                evidence kept pointing at a handful of moments that carry almost all the risk.
                Designing less, more precisely, is usually the stronger move.
              </p>
              <p>
                The next step I would take: instrument the funnel and A/B test the cost-transparency
                change first, since the research ranks it as the highest-impact fix. Design plans
                are hypotheses until the data comes in.
              </p>
              <div className="artifacts">
                <Button
                  as="a"
                  variant="ghost"
                  href="https://app.moqups.com/q5ty46YtONqwufmZo2EgYtreSkZxfPYm/view/page/ad64222d5"
                  target="_blank"
                  rel="noopener"
                >
                  Sign-up &amp; log-in flow in Moqups
                </Button>
                <Button
                  as="a"
                  variant="ghost"
                  href="/assets/rare-rabbit-wireframes.pdf"
                  target="_blank"
                  rel="noopener"
                >
                  View the full wireframe PDF
                </Button>
                <Button
                  as="a"
                  variant="ghost"
                  href="https://drive.google.com/file/d/1wTKRkKail8UhGEQ0rxL-mWqr4ggzyOGF/view?usp=drive_link"
                  target="_blank"
                  rel="noopener"
                >
                  Design walkthrough
                </Button>
              </div>
            </div>
          </section>
        </div>

        <nav className="case-nav" aria-label="More case studies">
          <div className="wrap case-nav-row">
            <Link href="/work/paypal">
              <small>Previous</small>← PayPal Wallet
            </Link>
            <Link href="/work/notion" style={{ textAlign: "right" }}>
              <small>Next case study</small>Notion: architecture before pixels →
            </Link>
          </div>
        </nav>
      </main>

      <Footer variant="case" />
    </>
  );
}
