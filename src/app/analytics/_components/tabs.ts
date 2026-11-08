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

export const DEFAULT_TABS = [
  { id: "overview", number: "01", label: "Overview" },
  { id: "readers", number: "02", label: "Readers" },
  { id: "content", number: "03", label: "Content" },
  { id: "performance", number: "04", label: "Performance" },
  { id: "security", number: "05", label: "Security" },
  { id: "newsletter", number: "06", label: "Newsletter" },
  { id: "agents", number: "07", label: "Agents" },
] as const satisfies readonly TabDef[];

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
