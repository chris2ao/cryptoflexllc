import nextDynamic from "next/dynamic";
import { ChartSkeleton, TallChartSkeleton } from "./skeletons";

// Lazy-loaded Recharts chart components (eliminates 300KB+ eager bundle).
// Charts replaced by editorial primitives (AxRankedList, AxDonut, TrendChartPanel).
// The underlying components are retained in _components/ for other usages.

export const PeakHoursHeatmap = nextDynamic(
  () => import("../_components/peak-hours-heatmap").then((m) => m.PeakHoursHeatmap),
  { loading: () => <ChartSkeleton /> }
);

export const ScrollDepthChart = nextDynamic(
  () => import("../_components/scroll-depth-chart").then((m) => m.ScrollDepthChart),
  { loading: () => <ChartSkeleton /> }
);

export const TimeOnPageChart = nextDynamic(
  () => import("../_components/time-on-page-chart").then((m) => m.TimeOnPageChart),
  { loading: () => <ChartSkeleton /> }
);

export const ApiResponseChart = nextDynamic(
  () => import("../_components/api-response-chart").then((m) => m.ApiResponseChart),
  { loading: () => <TallChartSkeleton /> }
);

export const BotTrendChart = nextDynamic(
  () => import("../_components/bot-trend-chart").then((m) => m.BotTrendChart),
  { loading: () => <ChartSkeleton /> }
);

export const AuthAttemptsChart = nextDynamic(
  () => import("../_components/auth-attempts-chart").then((m) => m.AuthAttemptsChart),
  { loading: () => <ChartSkeleton /> }
);

export const NewVsReturningChart = nextDynamic(
  () => import("../_components/new-vs-returning-chart").then((m) => m.NewVsReturningChart),
  { loading: () => <ChartSkeleton /> }
);

export const SubscriberGrowthChart = nextDynamic(
  () => import("../_components/subscriber-growth-chart").then((m) => m.SubscriberGrowthChart),
  { loading: () => <ChartSkeleton /> }
);

export const GmailMetricsChart = nextDynamic(
  () => import("../_components/gmail-metrics-chart").then((m) => m.GmailMetricsChart),
  { loading: () => <TallChartSkeleton /> }
);
