import taxonomy from "@/content/tag-taxonomy.json";

const TOPICS: readonly string[] = taxonomy.topics;
const MAP: Readonly<Record<string, string | null>> = taxonomy.map;

const TOPIC_BY_LOWER = new Map(TOPICS.map((t) => [t.toLowerCase(), t]));
const MAP_BY_LOWER = new Map(
  Object.entries(MAP).map(([tag, topic]) => [tag.toLowerCase(), topic])
);

/**
 * Resolves a URL tag or category value to a current topic name.
 *
 * A topic resolves to itself (case-insensitive), an old tag resolves to the
 * topic it was folded into, and a dropped or unknown tag resolves to null.
 */
export function resolveTopic(name: string): string | null {
  const key = name.trim().toLowerCase();
  return TOPIC_BY_LOWER.get(key) ?? MAP_BY_LOWER.get(key) ?? null;
}
