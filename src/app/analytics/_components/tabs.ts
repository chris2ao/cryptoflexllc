/**
 * Tab and range definitions for the analytics dashboard.
 *
 * This module has no "use client" directive on purpose: the page (a server
 * component) iterates DEFAULT_TABS, and a value imported from a client
 * module arrives on the server as a client reference, not an array.
 */

export type TabDef = {
  id: string;
  number: string;
  label: string;
};

export const DEFAULT_TABS: TabDef[] = [
  { id: "overview", number: "01", label: "Overview" },
  { id: "audience", number: "02", label: "Audience" },
  { id: "content", number: "03", label: "Content" },
  { id: "technology", number: "04", label: "Technology" },
  { id: "performance", number: "05", label: "Performance" },
  { id: "security", number: "06", label: "Security" },
  { id: "newsletter", number: "07", label: "Newsletter" },
  { id: "activity", number: "08", label: "Activity" },
  { id: "automation", number: "09", label: "Automation" },
];

export type RangeDef = {
  id: string;
  days: number;
  label: string;
};

export const DEFAULT_RANGES: RangeDef[] = [
  { id: "24h", days: 1, label: "24H" },
  { id: "7d", days: 7, label: "7D" },
  { id: "30d", days: 30, label: "30D" },
  { id: "90d", days: 90, label: "90D" },
  { id: "12m", days: 365, label: "12M" },
];
