import { seriesHref } from "@/lib/home-content";

export interface ProofLink {
  readonly label: string;
  readonly href: string;
}

export interface Offer {
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
  readonly proof: readonly ProofLink[];
}

export interface Step {
  readonly title: string;
  readonly line: string;
}

export const SECURITY_SERIES_HREF = seriesHref("Security Engineering");

export const OFFERS: readonly Offer[] = [
  {
    title: "Security review of AI agent setups",
    summary:
      "For teams running Claude Code, MCP servers or autonomous agents. A fixed-scope review of the harness, permissions, secrets handling, prompt-injection surface and CI gates, ending in a written findings report ranked by severity.",
    bullets: [
      "A map of what each agent can read, write and run",
      "Findings ranked by severity, each with a fix you can act on",
      "A short handoff so your team can keep the fixes in place",
    ],
    proof: [
      {
        label: "Round Two: The Security Review Where a Blog Draft Could Run Code",
        href: "/blog/security-review-round-two",
      },
      {
        label: "I Audited My Own Code. 19 Security Findings Later...",
        href: "/blog/security-hardening-analytics-dashboard",
      },
      {
        label: "The Folder Name That Gave Orders",
        href: "/blog/the-folder-name-that-gave-orders-prompt-injection",
      },
    ],
  },
  {
    title: "Detection engineering for small teams",
    summary:
      "Log pipeline design, SIEM deployment on Wazuh and ClickHouse, detections built from DNS and firewall data, and dashboards that show what fired and why.",
    bullets: [
      "A log pipeline sized for your team, not a SOC",
      "Detections tuned against your own DNS and firewall data",
      "Dashboards that show what fired and why",
    ],
    proof: [
      { label: "Custom SIEM series", href: seriesHref("Custom SIEM") },
      {
        label: "Homelab Wazuh Deployment series",
        href: seriesHref("Homelab Wazuh Deployment"),
      },
      {
        label: "Home Network Mission Control series",
        href: seriesHref("Home Network Mission Control"),
      },
    ],
  },
];

export const STEPS: readonly Step[] = [
  {
    title: "Scoping call",
    line: "A short conversation to decide whether it is a fit and what the scope is.",
  },
  {
    title: "Fixed-scope work",
    line: "A review with a defined scope, or a build in phases against a written plan.",
  },
  {
    title: "Report and handoff",
    line: "Findings ranked by severity, fixes you can act on, and a handoff your team can run without me.",
  },
];
