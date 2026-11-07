import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";
import {
  OFFERS,
  STEPS,
  SECURITY_SERIES_HREF,
  type Offer,
} from "@/lib/services-content";

const DESCRIPTION =
  "Security review of AI agent setups and detection engineering for small teams, from CryptoFlex LLC. Fixed scope, written findings, and posts as proof.";

export const metadata: Metadata = {
  title: "Services",
  description: DESCRIPTION,
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  openGraph: {
    title: "Consulting Services",
    description: DESCRIPTION,
    url: `${BASE_URL}/services`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Consulting+Services&author=CryptoFlex+LLC`,
        width: 1200,
        height: 630,
        alt: "CryptoFlex LLC Consulting Services",
      },
    ],
  },
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function OfferPanel({ offer, index }: { offer: Offer; index: number }) {
  return (
    <article className="ed-offer">
      <p className="ed-offer-idx">
        {pad(index + 1)} / {pad(OFFERS.length)}
      </p>
      <h2 className="font-heading">{offer.title}</h2>
      <p className="ed-offer-summary">{offer.summary}</p>
      <ul className="ed-offer-list">
        {offer.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="ed-offer-proof">
        <p className="ed-offer-idx">Read first</p>
        <ul>
          {offer.proof.map((p) => (
            <li key={p.href}>
              <Link href={p.href}>{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 04 / Consulting"
        overline="Services"
        title={
          <>
            Two kinds of work,{" "}
            <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>
              with receipts.
            </em>
          </>
        }
        lede="I take on a small number of engagements through CryptoFlex LLC each year. Two kinds of work, each backed by posts you can read before we talk."
      />
      <section className="py-8 sm:py-12">
        <div className="ed-wrap">
          <div className="ed-offers">
            {OFFERS.map((offer, i) => (
              <OfferPanel key={offer.title} offer={offer} index={i} />
            ))}
          </div>

          <h2 className="ed-steps-title font-heading">How an engagement works</h2>
          <ol className="ed-steps">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="ed-step-idx">{pad(i + 1)}</span>
                <h3 className="font-heading">{step.title}</h3>
                <p>{step.line}</p>
              </li>
            ))}
          </ol>

          <div className="ed-offers-cta">
            <Link href="/contact" className="btn-editorial btn-editorial--primary">
              Get in touch
            </Link>
            <Link href={SECURITY_SERIES_HREF} className="ed-offers-cta-link">
              Read the security reviews first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
