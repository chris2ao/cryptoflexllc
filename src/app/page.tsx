import type { Metadata } from "next";
import { HeroIdentity } from "@/components/home/hero-identity";
import { TickerStrip } from "@/components/home/ticker-strip";
import { JournalSection } from "@/components/home/journal-section";
import { AboutSection } from "@/components/home/about-section";
import { SelectedWork } from "@/components/home/selected-work";
import { ConsultingSection } from "@/components/home/consulting-section";
import { CVTimeline } from "@/components/home/cv-timeline";
import { SubscribeBlock } from "@/components/home/subscribe-block";
import { MotionLayer } from "@/components/home/motion-layer";
import { getAllPosts } from "@/lib/blog";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    absolute: "CryptoFlex LLC | Chris Johnson — Build in public. Break things on purpose.",
  },
  description:
    "Personal blog and portfolio of Chris Johnson: cybersecurity engineering, AI-assisted development with Claude Code, and infrastructure built from the ground up.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "CryptoFlex LLC: Build in public. Break things on purpose.",
    description:
      "Personal blog and portfolio: cybersecurity engineering, AI-assisted development, and infrastructure.",
    url: BASE_URL,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Build+in+public.+Break+things+on+purpose.&author=Chris+Johnson`,
        width: 1200,
        height: 630,
        alt: "CryptoFlex LLC — Chris Johnson",
      },
    ],
  },
};

export default function HomePage() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, 6);

  const tickerItems = [
    { label: "POSTS PUBLISHED", value: String(allPosts.length), accent: true },
    { label: "TESTS PASSING", value: "589" },
    { label: "CODE COVERAGE", value: "98%", accent: true },
    { label: "ACTIVE PROJECTS", value: "5" },
    { label: "AGENTS ORCHESTRATED", value: "7", accent: true },
    { label: "COMMITS / 7 DAYS", value: "117" },
    { label: "UPTIME / 90 DAYS", value: "99.97%", accent: true },
    { label: "COFFEE / WEEK", value: "21 cups" },
  ];

  return (
    <>
      <main>
        <HeroIdentity />
        <TickerStrip items={tickerItems} />
        <JournalSection posts={posts} totalCount={allPosts.length} />
        <AboutSection />
        <SelectedWork />
        <ConsultingSection />
        <CVTimeline />
        <SubscribeBlock />
      </main>
      <MotionLayer />
    </>
  );
}
