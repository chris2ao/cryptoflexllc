import { getDb } from "@/lib/analytics";

export interface OpsTableRow {
  name: string;
  rows: number;
  bytes: number;
}
export interface OpsCronRow {
  name: string;
  ran_at: string;
  ok: boolean;
  duration_ms: number;
  note: string;
}
export interface OpsServerEventRow {
  route: string;
  kind: string;
  count: number;
  last: string;
}
export interface OpsData {
  tables: OpsTableRow[];
  cronRuns: OpsCronRow[];
  serverEvents7d: OpsServerEventRow[];
}

type Row = Record<string, unknown>;

function iso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return v == null ? "" : String(v);
}

export async function loadOps(): Promise<OpsData> {
  const sql = getDb();

  const [tables, cronRuns, events] = await Promise.all([
    sql`
      SELECT relname AS name, n_live_tup::bigint AS rows, pg_total_relation_size(relid)::bigint AS bytes
      FROM pg_stat_user_tables
      ORDER BY bytes DESC
    `.catch(() => []),
    sql`
      SELECT name, ran_at, ok, duration_ms, note
      FROM cron_runs
      ORDER BY ran_at DESC
      LIMIT 15
    `.catch(() => []),
    sql`
      SELECT route, kind, COUNT(*)::int AS count, MAX(occurred_at) AS last
      FROM server_events
      WHERE occurred_at >= NOW() - INTERVAL '7 days'
      GROUP BY route, kind
      ORDER BY count DESC, last DESC
    `.catch(() => []),
  ]);

  return {
    tables: (tables as Row[]).map((r) => ({
      name: String(r.name),
      rows: Number(r.rows) || 0,
      bytes: Number(r.bytes) || 0,
    })),
    cronRuns: (cronRuns as Row[]).map((r) => ({
      name: String(r.name),
      ran_at: iso(r.ran_at),
      ok: Boolean(r.ok),
      duration_ms: Number(r.duration_ms) || 0,
      note: r.note == null ? "" : String(r.note),
    })),
    serverEvents7d: (events as Row[]).map((r) => ({
      route: String(r.route),
      kind: String(r.kind),
      count: Number(r.count) || 0,
      last: iso(r.last),
    })),
  };
}
