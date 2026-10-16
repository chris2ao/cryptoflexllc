import Link from "next/link";
import { SectionLabel } from "./section-label";

type Props = {
  index: number;
};

const CAREER_PATH = [
  { role: "Military intelligence", detail: "Analyst, Iraq & Afghanistan" },
  { role: "Chem/bio defense", detail: "Pentagon & US Capitol" },
  { role: "IT operations", detail: "Service desk to developer" },
  { role: "Security & cloud engineering", detail: "Controls & infrastructure" },
  { role: "Cyber defense operations", detail: "Now" },
] as const;

export function AboutSection({ index }: Props) {
  const lastStep = CAREER_PATH.length - 1;

  return (
    <section id="about" className="ed-section reveal">
      <SectionLabel index={index} name="About the Author" />
      <div className="ed-wrap">
        <h2 className="sr-only">About the author</h2>
        <div className="ed-about">
          <figure>
            <blockquote className="ed-about-quote">
              <p>
                Everything I know about securing software has an expiration
                date.
              </p>
            </blockquote>
            <figcaption className="ed-about-attr">
              <b>Chris Johnson</b>, in{" "}
              <Link href="/blog/tryhackme-ai1-ai-security-certification">
                Building With AI, Defending Against It
              </Link>
            </figcaption>
          </figure>

          <div className="ed-about-prose">
            <p>
              My day job is cybersecurity defense operations: detection,
              response, and resilience. The road here was unusual, and every
              stop left a fingerprint on how I build:
            </p>
            <ol className="ed-career-path" aria-label="Career path">
              {CAREER_PATH.map((step, i) => (
                <li key={step.role} className={i === lastStep ? "now" : undefined}>
                  {step.role} <span>{step.detail}</span>
                </li>
              ))}
            </ol>
            <p>
              This blog is where I build in public. Most posts are postmortems
              of projects I&apos;m still wrestling with, from security reviews
              of my own code to a home-lab SOC and the agent workflows behind
              all of it. They&apos;re written from inside the build, not from
              the tidy other side.
            </p>
            <p className="ed-about-note">
              I also take on a small number of security and infrastructure
              engagements through CryptoFlex LLC.{" "}
              <Link href="/services">
                See services <span aria-hidden="true">→</span>
              </Link>{" "}
              <Link href="/about">
                More about me <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
