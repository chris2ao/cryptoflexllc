import type { ReactElement } from "react";
import type { DEFAULT_TABS } from "../_components/analytics-shell";
import { OverviewSection } from "./overview";
import { ReadersSection } from "./readers";
import { ContentSection } from "./content";
import { PerformanceSection } from "./performance";
import { SecuritySection } from "./security";
import { NewsletterSection } from "./newsletter";
import { AgentsSection } from "./agents";
import {
  OverviewSkeleton,
  ReadersSkeleton,
  ContentSkeleton,
  TelemetrySkeleton,
  SecuritySkeleton,
  NewsletterSkeleton,
  SectionSkeleton,
} from "./skeletons";

export type TabId = (typeof DEFAULT_TABS)[number]["id"];

export const SECTIONS: Record<
  TabId,
  (props: { days: number }) => Promise<ReactElement>
> = {
  overview: OverviewSection,
  readers: ReadersSection,
  content: ContentSection,
  performance: PerformanceSection,
  security: SecuritySection,
  newsletter: NewsletterSection,
  agents: AgentsSection,
};

export const SKELETONS: Record<TabId, () => ReactElement> = {
  overview: OverviewSkeleton,
  readers: ReadersSkeleton,
  content: ContentSkeleton,
  performance: TelemetrySkeleton,
  security: SecuritySkeleton,
  newsletter: NewsletterSkeleton,
  agents: SectionSkeleton,
};
