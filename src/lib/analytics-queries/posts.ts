// Stub for the wave 2 seam; implemented by Task 5.
import type { TrafficScope } from "./shared";

export type PostPerformanceRow = {
  page_path: string;
  title: string;
  views: number;
  readers: number;
  read_through_pct: number;
  median_seconds: number;
  subscribes: number;
  comments: number;
};

export async function loadPostPerformance(
  _days: number,
  _scope: TrafficScope,
  _limit = 25
): Promise<PostPerformanceRow[]> {
  return [];
}
