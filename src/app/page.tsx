import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HeroIdentity } from "@/components/home/hero-identity";
import { NowStrip } from "@/components/home/now-strip";
import { JournalSection } from "@/components/home/journal-section";
import { ReadingPaths } from "@/components/home/reading-paths";
import { SelectedWork } from "@/components/home/selected-work";
import { ArcadeSection } from "@/components/home/arcade-section";
import { AboutSection } from "@/components/home/about-section";
import { SubscribeBlock } from "@/components/home/subscribe-block";
import { MotionLayer } from "@/components/home/motion-layer";
import { getAllPosts } from "@/lib/blog";
import {
  getSeriesInProgress,
  pickReadingPaths,
  summarizeSeries,
} from "@/lib/home-content";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    absolute: "CryptoFlex LLC | Chris Johnson: Build in public. Break things on purpose.",
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
        alt: "CryptoFlex LLC, Chris Johnson",
      },
    ],
  },
};

type NumberedSection = (index: number) => ReactNode;

export default function HomePage() {
  const allPosts = getAllPosts();
  const series = summarizeSeries(allPosts);
  const paths = pickReadingPaths(series);

  // Numbered sections in page order. Section numbers come from position in
  // this list, so a section that has nothing to show never leaves a gap.
  const sections: NumberedSection[] = [
    (i) => <JournalSection key="blog" index={i} posts={allPosts.slice(0, 6)} totalCount={allPosts.length} />,
    ...(paths.length > 0
      ? [(i: number) => <ReadingPaths key="paths" index={i} series={paths} />]
      : []),
    (i) => <SelectedWork key="work" index={i} series={series} />,
    (i) => <ArcadeSection key="arcade" index={i} />,
    (i) => <AboutSection key="about" index={i} />,
  ];

  return (
    <>
      <main>
        <HeroIdentity postCount={allPosts.length} latestDate={allPosts[0]?.date} />
        <NowStrip inProgress={getSeriesInProgress(allPosts)} />
        {sections.map((render, i) => render(i + 1))}
        <SubscribeBlock />
      </main>
      <MotionLayer />
    </>
  );
}
