/** Shared TypeScript interfaces for the analytics dashboard */

export interface DailyViews {
  date: string;
  views: number;
  unique_visitors: number;
}

export interface MapLocation {
  latitude: string;
  longitude: string;
  views: number;
  city: string;
  country: string;
}

export interface TopPageRow {
  page_path: string;
  views: number;
  unique_views: number;
}

export interface CountryRow {
  country: string;
  views: number;
  unique_visitors: number;
}

export interface BrowserRow {
  browser: string;
  count: number;
}

export interface DeviceRow {
  device_type: string;
  count: number;
}

export interface OsRow {
  os: string;
  count: number;
}

export interface RecentVisit {
  id: number;
  visited_at: string;
  page_path: string;
  ip_address: string;
  browser: string;
  os: string;
  device_type: string;
  referrer: string;
  country: string;
  city: string;
  region: string;
}

// ---- Vercel API types ----

/** Firewall rule from Vercel WAF config */
export interface VercelFirewallRule {
  id: string;
  name: string;
  active: boolean;
  conditionGroup: Array<{
    conditions: Array<{
      type: string;
      op: string;
      neg?: boolean;
      value: string;
    }>;
  }>;
  action: {
    type: string; // "deny" | "log" | "challenge" | "bypass" | "rate_limit"
  };
}

/** IP rule from Vercel WAF config */
export interface VercelFirewallIpRule {
  id: string;
  ip: string;
  hostname?: string;
  action: string;
  notes?: string;
}

/** Managed ruleset entry (e.g. OWASP categories) */
export interface VercelManagedRuleAction {
  action: string;
  active: boolean;
}

/** GET /v1/security/firewall/config/active response */
export interface VercelFirewallConfig {
  ownerId: string;
  projectKey: string;
  id: string;
  version: number;
  firewallEnabled: boolean;
  crs?: Record<string, VercelManagedRuleAction>;
  rules?: VercelFirewallRule[];
  ips?: VercelFirewallIpRule[];
  managedRules?: Record<string, unknown>;
}

/** Anomaly alert from attack status */
export interface VercelAnomalyAlert {
  zscore?: number;
  requestCount?: number;
  stddev?: number;
}

/** DDoS alert from attack status */
export interface VercelDdosAlert {
  timestamp?: number;
  totalRequests?: number;
}

/** A single attack anomaly entry */
export interface VercelAnomaly {
  projectId: string;
  ownerId: string;
  startTime: string;
  endTime: string;
  atMinute: string;
  state: string;
  affectedHostMap?: Record<
    string,
    {
      anomalyAlerts?: VercelAnomalyAlert[];
      ddosAlerts?: VercelDdosAlert[];
    }
  >;
}

/** GET /v1/security/firewall/attack-status response */
export interface VercelAttackStatus {
  anomalies: VercelAnomaly[];
}

/** A single firewall event/action */
export interface VercelFirewallAction {
  startTime: string;
  endTime: string;
  isActive: boolean;
  action_type: string;
  host: string;
  public_ip: string;
  count: number;
}

/** GET /v1/security/firewall/events response */
export interface VercelFirewallEvents {
  actions: VercelFirewallAction[];
}

// ---- Web Vitals types ----

/** Aggregated Web Vitals metric for the dashboard */
export interface WebVitalsSummary {
  metric_name: string;
  p50: number;
  p75: number;
  p95: number;
  avg: number;
  total_samples: number;
  good_count: number;
  needs_improvement_count: number;
  poor_count: number;
}

export interface CommentRow {
  id: number;
  slug: string;
  comment: string;
  reaction: "up" | "down";
  email: string;
  created_at: string;
}

export interface SubscriberRow {
  id: number;
  email: string;
  subscribed_at: string;
  active: boolean;
  ip_address: string;
  country: string;
  city: string;
  region: string;
}

// ---- New analytics metric types ----

/** Referrer breakdown grouped by domain */
export interface ReferrerRow {
  referrer_domain: string;
  views: number;
  unique_visitors: number;
}

/** Hour-of-day x day-of-week heatmap cell */
export interface HourlyHeatmapRow {
  day_of_week: number; // 0 = Sunday ... 6 = Saturday
  hour: number; // 0-23
  views: number;
}

/** Scroll depth stats per page */
export interface ScrollDepthRow {
  page_path: string;
  depth_25: number;
  depth_50: number;
  depth_75: number;
  depth_100: number;
}

/** Average time-on-page per page */
export interface TimeOnPageRow {
  page_path: string;
  avg_seconds: number;
  sample_count: number;
}

/** API response time metrics (aggregated per endpoint) */
export interface ApiMetricRow {
  endpoint: string;
  method: string;
  avg_ms: number;
  p50: number;
  p75: number;
  p95: number;
  error_count: number;
  total_count: number;
}

/** Daily API response time trend */
export interface ApiMetricDailyRow {
  date: string;
  avg_ms: number;
  p50: number;
  p75: number;
  p95: number;
  error_count: number;
  total_count: number;
}

/** Bot vs human traffic trend */
export interface BotTrendRow {
  date: string;
  bot_count: number;
  human_count: number;
  bot_pct: number;
}

/** Auth attempt trend */
export interface AuthAttemptRow {
  date: string;
  success_count: number;
  fail_count: number;
}

/** New vs returning visitor trend */
export interface NewVsReturningRow {
  date: string;
  new_visitors: number;
  returning_visitors: number;
}

export interface IpIntelData {
  ip_address: string;
  isp: string;
  org: string;
  as_number: string;
  as_name: string;
  is_proxy: boolean;
  is_hosting: boolean;
  is_mobile: boolean;
  country: string;
  city: string;
  region: string;
  whois_org: string;
  whois_address: string;
  reverse_address: string;
  reverse_county: string;
  reverse_state: string;
  latitude: string;
  longitude: string;
  cached_at: string;
}
