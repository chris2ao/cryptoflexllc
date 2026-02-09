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
