import type { ReactElement } from "react";
import type { DEFAULT_TABS } from "../_components/tabs";
import { OverviewSection } from "./overview";
import { AudienceSection } from "./audience";
import { ContentSection } from "./content";
import { TechnologySection } from "./technology";
import { PerformanceSection } from "./performance";
import { SecuritySection } from "./security";
import { NewsletterSection } from "./newsletter";
import { ActivitySection } from "./activity";
import { AutomationSection } from "./automation";
import {
  OverviewSkeleton,
  AudienceSkeleton,
  ContentSkeleton,
  TechSkeleton,
  TelemetrySkeleton,
  SecuritySkeleton,
  NewsletterSkeleton,
  ActivitySkeleton,
  SectionSkeleton,
} from "./skeletons";

export type TabId = (typeof DEFAULT_TABS)[number]["id"];

export const SECTIONS: Record<
  TabId,
  (props: { days: number }) => Promise<ReactElement>
> = {
  overview: OverviewSection,
  audience: AudienceSection,
  content: ContentSection,
  technology: TechnologySection,
  performance: PerformanceSection,
  security: SecuritySection,
  newsletter: NewsletterSection,
  activity: ActivitySection,
  automation: AutomationSection,
};

export const SKELETONS: Record<TabId, () => ReactElement> = {
  overview: OverviewSkeleton,
  audience: AudienceSkeleton,
  content: ContentSkeleton,
  technology: TechSkeleton,
  performance: TelemetrySkeleton,
  security: SecuritySkeleton,
  newsletter: NewsletterSkeleton,
  activity: ActivitySkeleton,
  automation: SectionSkeleton,
};
