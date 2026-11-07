import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";
import { seriesHref } from "@/lib/home-content";
import { IDENTITY_LINE, SITE_DESCRIPTION } from "@/lib/identity";

export const metadata: Metadata = {
  title: "About",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About Chris Johnson",
    description: SITE_DESCRIPTION,
    url: `${BASE_URL}/about`,
    type: "profile",
    images: [
      {
        url: `${BASE_URL}/api/og?title=About+Chris+Johnson&author=CryptoFlex+LLC`,
        width: 1200,
        height: 630,
        alt: "About Chris Johnson",
      },
    ],
  },
};

const CAREER_PATH = [
  { role: "Military intelligence", detail: "Analyst, Iraq & Afghanistan" },
  { role: "Chem/bio defense", detail: "Pentagon & US Capitol" },
  { role: "IT operations", detail: "Service desk to developer" },
  { role: "Security & cloud engineering", detail: "Controls & infrastructure" },
  { role: "Cyber defense operations", detail: "Now" },
] as const;

const SKILLS = [
  "Security Engineering",
  "SOC Operations",
  "Cloud Architecture",
  "Network Infrastructure",
  "Incident Response",
  "Threat Detection",
  "SIEM/SOAR",
  "Python",
  "PowerShell",
  "Automation",
  "AI/ML Tooling",
  "Infrastructure Design",
] as const;

const H2 = "font-heading text-2xl font-bold tracking-tight text-foreground";
const BODY = "font-body text-base leading-relaxed text-muted-foreground";
const LINK = "text-primary underline underline-offset-4";
const SIDE_LABEL = "ed-overline mb-3";

function SeriesLink({ name }: { name: string }) {
  return (
    <Link href={seriesHref(name)} className={LINK}>
      {name}
    </Link>
  );
}

function WhatThisSiteIs() {
  return (
    <section className="space-y-4 border-t border-border pt-8">
      <h2 className={H2}>What this site is</h2>
      <p className={BODY}>
        This is where I build in public. Most posts are postmortems of projects
        I am still wrestling with, written from inside the build instead of
        from the tidy other side.
      </p>
      <p className={BODY}>
        The security reviews of this site are here, along with the home-lab SOC
        across the <SeriesLink name="Custom SIEM" />,{" "}
        <SeriesLink name="Homelab Wazuh Deployment" /> and{" "}
        <SeriesLink name="Home Network Mission Control" /> series. So are the
        agent workflows and the{" "}
        <SeriesLink name="Claude Harness Modernization" /> series, plus
        Ledgerly, Cramdex and the Arcade games.
      </p>
    </section>
  );
}

function RoadHere() {
  const lastStep = CAREER_PATH.length - 1;
  return (
    <section className="space-y-4 border-t border-border pt-8">
      <h2 className={H2}>The road here</h2>
      <p className={BODY}>
        My career has taken a few sharp turns, and each one left something I
        still use.
      </p>
      <ol className="ed-career-path ed-career-path--stacked" aria-label="Career path">
        {CAREER_PATH.map((step, i) => (
          <li key={step.role} className={i === lastStep ? "now" : undefined}>
            {step.role} <span>{step.detail}</span>
          </li>
        ))}
      </ol>
      <p className={BODY}>
        Then I left contracting, moved to Florida, and went back to school. I
        earned a B.S. in Information Technology at FIU, Magna Cum Laude, to
        build a stronger technical foundation. Today my day job is cyber
        defense operations: detection, response, and resilience.
      </p>
    </section>
  );
}

function WhyIWrite() {
  return (
    <section className="space-y-4 border-t border-border pt-8">
      <h2 className={H2}>Why I write</h2>
      <p className={BODY}>
        The fastest way I learn is to build in public. Writing down what broke
        and what held up keeps me honest, and it might save someone else an
        afternoon.
      </p>
    </section>
  );
}

function WorkWithMe() {
  return (
    <section className="space-y-4 border-t border-border pt-8">
      <h2 className={H2}>Work with me</h2>
      <p className={BODY}>
        I also take on a small number of engagements through CryptoFlex LLC:
        security reviews of AI agent setups and detection engineering for small
        teams.{" "}
        <Link href="/services" className={LINK}>
          See services
        </Link>
        .
      </p>
    </section>
  );
}

function Sidebar() {
  return (
    <aside className="order-1 space-y-8 md:order-2">
      <Image
        src="/CJOutside.jpeg"
        alt="Chris Johnson"
        width={400}
        height={400}
        className="aspect-square w-full object-cover ring-1 ring-border"
        priority
      />
      <div>
        <h2 className={SIDE_LABEL}>Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <li key={skill} className="ed-tag">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={SIDE_LABEL}>Education</h2>
        <p className="font-body text-sm text-muted-foreground">
          <span className="font-heading font-semibold text-foreground">
            B.S. Information Technology
          </span>
          <br />
          Florida International University
          <br />
          Magna Cum Laude
        </p>
      </div>
    </aside>
  );
}

export default function AboutPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 02 / About the Author"
        overline="Profile"
        title={
          <>
            About{" "}
            <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>
              Chris.
            </em>
          </>
        }
        lede={IDENTITY_LINE}
      />
      <section className="py-8 sm:py-12">
        <div className="ed-wrap grid gap-12 md:grid-cols-3">
          <div className="order-2 space-y-10 md:order-1 md:col-span-2">
            <WhatThisSiteIs />
            <RoadHere />
            <WhyIWrite />
            <WorkWithMe />
          </div>
          <Sidebar />
        </div>
      </section>
    </>
  );
}
