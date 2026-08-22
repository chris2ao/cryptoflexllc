# Gmail unsubscribe approval panel (site half of Track 3)

Branch `feat/gmail-unsubscribe-panel` (from main `02a14e8`). Approved master plan: `~/.claude/plans/i-want-to-continue-fluffy-hummingbird.md` (Track 3). The agent half ships separately in `chris2ao-gmail-agent` after this PR is deployed.

## Context

The local Gmail agent (Python, Mac Mini, launchd twice daily) will publish sender-level unsubscribe candidates to this site and read the operator's decisions back on its next run. The operator reviews candidates on the analytics page (Automation tab, `ClaudeAutomationSection` in `src/app/analytics/page.tsx`), clicks Approve (unsubscribe) or Deny (keep allowing), and can flip either decision later; every click is kept in an append-only ledger. The agent also reports each unsubscribe attempt and, 14 days later, whether the sender went silent.

PRIVACY: this repository is PUBLIC. Sender addresses live only in the Neon Postgres database, never in committed files. Unsubscribe URLs never reach the site at all (the agent keeps them locally); the API rejects any payload containing `http`, `mailto:`, or `<`. Test fixtures use `example.com` senders only.

Existing conventions to follow: cookie auth via `verifyApiAuth` from `src/lib/analytics-auth.ts` (see `src/app/api/subscribers/[id]/route.ts`); bearer checks with `timingSafeEqual` (see `src/app/api/cron/weekly-digest/route.ts`); `createRateLimiter({ name, windowMs, maxRequests })` + `getClientIp(request)` from `src/lib/rate-limit.ts` (see `src/app/api/comments/route.ts`), returning 429 with `Retry-After` when `allowed` is false; Zod schemas for bodies; `getDb()` from `src/lib/analytics` returning a tagged-template `sql`; tables created in `src/app/api/analytics/setup/route.ts` (`CREATE TABLE IF NOT EXISTS`, gated by `ANALYTICS_SETUP_ENABLED` + cookie auth); env schema in `src/lib/env.ts`; types in `src/lib/analytics-types.ts`; route tests co-located (`route.test.ts`) mocking `@/lib/analytics`, `@/lib/analytics-auth`, `@/lib/rate-limit` with Vitest (see `src/app/api/subscribers/[id]/route.test.ts`); client components under `src/app/analytics/_components/` (see `subscriber-panel.tsx` for the table markup, badge classes, `Loader2` usage, fetch + state pattern); panels wrapped in `<AxPanel title kicker>` (`_components/ax-panel.tsx`); lucide-react icons; Tailwind classes and the existing oklch tokens.

## Global Constraints

- TDD: failing tests first. Gates before every commit: `npm run lint` (baseline: 0 errors, 1 pre-existing warning), `npm run type-check` (clean), `npm test` (baseline 818 passed). No new lint errors or warnings.
- No sender data or URLs in committed files; `example.com` fixtures only.
- All five routes rate limited and Zod validated; JSON responses shaped `{ ok: true, ... }` on success and `{ error: string }` on failure; never echo request bodies back in error responses.
- Agent routes: `Authorization: Bearer <GMAIL_AGENT_API_TOKEN>` verified with `timingSafeEqual`; 503 `{ error: "Agent API not configured" }` when the env var is unset; 401 otherwise. Operator routes: `verifyApiAuth(request)` (cookie).
- No em dashes anywhere (code comments, docs, commit messages). Conventional commit subjects as named per task; factual bodies; NO Co-Authored-By trailer.
- Do not add a cron (all three Hobby slots are used). Do not touch `src/data/*` (the agent's export script commits there).
- Keep files under ~300 lines; split components and helpers where they grow.

## Data model (Neon Postgres)

```sql
CREATE TABLE IF NOT EXISTS gmail_unsubscribe_candidates (
  sender_email      VARCHAR(320) PRIMARY KEY,
  sender_domain     VARCHAR(255) NOT NULL DEFAULT '',
  method            VARCHAR(20)  NOT NULL,
  trashed_count_14d INTEGER      NOT NULL DEFAULT 0,
  first_seen        TIMESTAMPTZ  NOT NULL,
  last_seen         TIMESTAMPTZ  NOT NULL,
  last_pushed_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS gmail_unsubscribe_decisions (
  id           SERIAL PRIMARY KEY,
  sender_email VARCHAR(320) NOT NULL,
  decision     VARCHAR(10)  NOT NULL,
  decided_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  note         VARCHAR(280)
);
CREATE INDEX IF NOT EXISTS idx_gmail_unsub_decisions_sender
  ON gmail_unsubscribe_decisions (sender_email, decided_at DESC);
CREATE TABLE IF NOT EXISTS gmail_unsubscribe_attempts (
  id                  SERIAL PRIMARY KEY,
  sender_email        VARCHAR(320) NOT NULL,
  attempted_at        TIMESTAMPTZ  NOT NULL,
  status_code         SMALLINT,
  succeeded           BOOLEAN      NOT NULL DEFAULT FALSE,
  silent_14d          BOOLEAN,
  silence_measured_at TIMESTAMPTZ,
  UNIQUE (sender_email, attempted_at)
);
```

Current decision per sender = `SELECT DISTINCT ON (sender_email) ... ORDER BY sender_email, decided_at DESC, id DESC`.

## API contracts (`src/app/api/gmail/unsubscribe/`)

| Route | Auth | Rate limit | Request | Response |
| --- | --- | --- | --- | --- |
| `POST candidates` | agent bearer | 60/min | `{ items: Candidate[] }` (1..500) | `{ ok: true, upserted: number }` |
| `GET decisions?full=1` | agent bearer | 60/min | none | `{ ok: true, generated_at, decisions: Decision[] }` (latest per sender; `full=1` adds `ledger: Decision[]`) |
| `POST attempts` | agent bearer | 60/min | `{ items: Attempt[] }` (1..100) | `{ ok: true, upserted: number }` |
| `GET panel` | cookie | 60/min | none | `PanelData` |
| `POST decisions` | cookie | 30/min | `{ sender_email, decision: "approve" \| "deny", note? }` | `{ ok: true, decision: Decision }` (404 if the sender is not a candidate) |

```ts
type Method = "rfc8058-post" | "http-get" | "mailto";
type Candidate = { sender_email: string; sender_domain: string; method: Method; trashed_count_14d: number; first_seen: string; last_seen: string };
type Attempt = { sender_email: string; attempted_at: string; status_code: number | null; succeeded: boolean; silent_14d?: boolean | null; silence_measured_at?: string | null };
type Decision = { id: number; sender_email: string; decision: "approve" | "deny"; decided_at: string; note: string | null };
type AttemptSummary = { attempted_at: string; status_code: number | null; succeeded: boolean; silent_14d: boolean | null; silence_measured_at: string | null };
type PanelRow = Candidate & { last_pushed_at: string; decision: "approve" | "deny" | null; decided_at: string | null; note: string | null; last_attempt: AttemptSummary | null; attempts_since_decision: number; history: Array<{ decision: "approve" | "deny"; decided_at: string; note: string | null }> };
type PanelSummary = { pending: number; approved: number; allowed: number; unsubscribed_7d: number; silence_measured: number; silence_silent: number; silence_rate: number | null; target: 0.8 };
type PanelData = { ok: true; generated_at: string; summary: PanelSummary; rows: PanelRow[] };
```

Privacy tripwire on both agent POSTs: before Zod parsing, test the raw body text against `/https?:|mailto:|</i`; any hit returns 400 `{ error: "Payload contains forbidden content" }` (log only the item index, never the content). Zod additionally `.refine`s every string field with the same regex. Emails are lowercased and capped at 320 chars, domains at 255, notes at 280.

---

### Task 1: env, auth helper, schemas, types

Files: `src/lib/env.ts`, `src/lib/gmail-agent-auth.ts` (new), `src/lib/gmail-agent-auth.test.ts` (new), `src/lib/gmail-unsubscribe-schemas.ts` (new), `src/lib/gmail-unsubscribe-schemas.test.ts` (new), `src/lib/analytics-types.ts`.

Tests first:
- `gmail-agent-auth.test.ts`: missing env -> `{ ok: false, status: 503 }`; wrong token -> 401; token of different length -> 401 (no throw from `timingSafeEqual`); missing header -> 401; correct token -> `{ ok: true }`.
- `gmail-unsubscribe-schemas.test.ts`: `containsForbidden("https://x")`, `containsForbidden("MAILTO:a")`, `containsForbidden("<b>")` true; plain email false; `candidateSchema` accepts a valid item and lowercases the email; rejects a bad method, a negative count, an invalid date, an email over 320 chars, a `note` over 280, and any string containing `http`; `candidatesBodySchema` rejects 0 and 501 items; `attemptsBodySchema` rejects 101 items; `decisionBodySchema` rejects a decision other than approve/deny.

Implementation:
- `env.ts`: `GMAIL_AGENT_API_TOKEN: z.string().min(32).optional()`.
- `gmail-agent-auth.ts`: `verifyGmailAgentAuth(request: Request): { ok: true } | { ok: false; status: 401 | 503 }` reading `process.env.GMAIL_AGENT_API_TOKEN`, comparing the `Bearer` token with `timingSafeEqual` inside a try/catch (length mismatch -> 401).
- `gmail-unsubscribe-schemas.ts`: `FORBIDDEN = /https?:|mailto:|</i`, `containsForbidden(text)`, `noForbidden = z.string().refine(...)`, `methodSchema`, `candidateSchema`, `candidatesBodySchema` (`items` 1..500), `attemptSchema`, `attemptsBodySchema` (`items` 1..100), `decisionBodySchema`. Export the inferred types.
- `analytics-types.ts`: add `UnsubscribeMethod`, `UnsubscribeCandidateRow`, `UnsubscribeDecision`, `UnsubscribeAttemptSummary`, `UnsubscribePanelRow`, `UnsubscribePanelSummary`, `UnsubscribePanelData` matching the contracts above.

Commit: `feat(gmail): agent bearer auth, unsubscribe schemas, and types`.

---

### Task 2: schema, allowlist, panel loader

Files: `src/app/api/analytics/setup/route.ts`, `vercel.json`, `src/lib/gmail-unsubscribe.ts` (new), `src/lib/gmail-unsubscribe.test.ts` (new).

Tests first (`gmail-unsubscribe.test.ts`, pure functions over fixture rows with `example.com` senders):
- `shapePanelRows`: latest decision wins (two decisions for one sender, later `decided_at` wins, ties broken by higher `id`); `attempts_since_decision` counts attempts at or after `decided_at`; `last_attempt` is the newest attempt; `history` is newest first; rows with no decision have `decision: null`; ordering is pending first by `trashed_count_14d` desc, then approved, then allowed.
- `summarize`: counts pending/approved/allowed; `unsubscribed_7d` counts succeeded attempts in the trailing 7 days of `now`; `silence_measured` / `silence_silent` / `silence_rate` (null when nothing measured); `target` is 0.8.
- `loadUnsubscribePanel`: with a mocked `sql` returning three result sets in order (candidates, decisions, attempts) it returns `PanelData`; when the first query rejects with `{ code: "42P01" }` it returns `null`; any other error propagates.
- `vercel.json`: `test("api allowlist includes gmail")` reading the file and asserting the regex source contains `|gmail)`.

Implementation:
- `setup/route.ts`: append the three `CREATE TABLE IF NOT EXISTS` statements and the index (exactly as the data model section) before the success response.
- `vercel.json`: add `gmail` to the `/api/(?!(?:...))` allowlist alternation (no other change).
- `gmail-unsubscribe.ts`: `loadUnsubscribePanel(sql, now = new Date()) -> Promise<UnsubscribePanelData | null>` (three queries: all candidates; all decisions ordered by `sender_email, decided_at DESC, id DESC`; all attempts ordered by `attempted_at DESC`), `shapePanelRows(candidates, decisions, attempts)`, `summarize(rows, now)`, `latestDecisions(decisions)` (one per sender). Keep the SQL in this module so the page and the `GET panel` route share one implementation.

Commit: `feat(gmail): unsubscribe tables, api allowlist, and panel loader`.

---

### Task 3: API routes

Files: `src/app/api/gmail/unsubscribe/candidates/route.ts` (+ `route.test.ts`), `src/app/api/gmail/unsubscribe/decisions/route.ts` (GET agent + POST operator, + `route.test.ts`), `src/app/api/gmail/unsubscribe/attempts/route.ts` (+ `route.test.ts`), `src/app/api/gmail/unsubscribe/panel/route.ts` (+ `route.test.ts`).

Tests first (mock `@/lib/analytics`, `@/lib/analytics-auth`, `@/lib/gmail-agent-auth`, `@/lib/rate-limit` like `src/app/api/subscribers/[id]/route.test.ts`; rate limiter mock resolves `{ allowed: true, remaining: 9 }` by default):
- candidates: 503 when auth helper reports unconfigured; 401 on bad token; 429 when the limiter denies (with `Retry-After`); 400 on a raw body containing `https://` BEFORE any DB call; 400 on a Zod failure; 200 `{ ok: true, upserted: n }` with a single `sql` call carrying parallel arrays (UNNEST upsert) and lowercase emails; a second identical push is idempotent (same call shape, no error).
- decisions GET: 401 without the bearer; returns latest per sender; `?full=1` adds `ledger`.
- decisions POST (operator): 401 without the cookie; 400 on bad body; 404 when the sender is not a candidate (mock the existence query returning `[]`); 200 inserts one ledger row and returns it.
- attempts: auth/limit/tripwire/Zod as candidates; upsert on `(sender_email, attempted_at)` with `silent_14d = COALESCE(EXCLUDED.silent_14d, t.silent_14d)` and the same for `silence_measured_at`.
- panel GET: 401 without the cookie; 503 `{ error: "Unsubscribe tables not set up" }` when the loader returns null; 200 `PanelData` otherwise.

Implementation: one file per route; each starts with the auth check, then the rate limiter keyed by `getClientIp`, then (for agent POSTs) `containsForbidden(rawText)`, then Zod `safeParse`, then the DB call inside try/catch returning 500 `{ error: "Internal error" }` on failure (log `console.error` with the route name only). Candidate upsert: `INSERT INTO gmail_unsubscribe_candidates (...) SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::int[], $5::timestamptz[], $6::timestamptz[]) ON CONFLICT (sender_email) DO UPDATE SET sender_domain = EXCLUDED.sender_domain, method = EXCLUDED.method, trashed_count_14d = EXCLUDED.trashed_count_14d, first_seen = LEAST(gmail_unsubscribe_candidates.first_seen, EXCLUDED.first_seen), last_seen = GREATEST(gmail_unsubscribe_candidates.last_seen, EXCLUDED.last_seen), last_pushed_at = NOW()` (with the neon tagged template, pass arrays as parameters). Keep each route under ~120 lines.

Commit: `feat(gmail): unsubscribe candidate, decision, attempt, and panel routes`.

---

### Task 4: the panel UI and page wiring

Files: `src/app/analytics/_components/unsubscribe-panel.tsx` (new), `src/app/analytics/_components/unsubscribe-row.tsx` (new), `src/app/analytics/_components/unsubscribe-panel.test.tsx` (new), `src/app/analytics/page.tsx`.

Tests first (`unsubscribe-panel.test.tsx` with React Testing Library, like `live-feed.test.tsx`; `fetch` mocked with `vi.stubGlobal`): renders the summary strip and the three sections from fixture `PanelData` (senders at `example.com`); clicking Approve on a pending row POSTs `{ sender_email, decision: "approve" }` to `/api/gmail/unsubscribe/decisions` and moves the row to the Approved section with a new history entry; a failed POST restores the row and shows the error banner; `initial: null` renders the "run /api/analytics/setup" banner and no table; Approve is disabled (with a `title` tooltip) for non-`rfc8058-post` rows; the Refresh button GETs `/api/gmail/unsubscribe/panel` and replaces the data.

Implementation:
- `unsubscribe-panel.tsx` ("use client"): props `{ initial: UnsubscribePanelData | null }`; state `data`, `actingSender`, `error`; `decide(sender, decision)` does an optimistic update (move the row, prepend to `history` with `decided_at = new Date().toISOString()`), POSTs, and rolls back on a non-OK response; `refresh()` GETs the panel; summary strip (pending, approved, allowed, unsubscribed this week, 14-day silence rate vs the 80 percent target); sections "Awaiting review" (Approve / Deny), "Approved to unsubscribe" (status badge, last attempt code, silence result, "Allow again"), "Allowed" ("Unsubscribe"). No `confirm()` dialogs.
- `unsubscribe-row.tsx`: one row with badges (pending `bg-yellow-500/20 text-yellow-400`, approved `bg-green-500/20 text-green-400`, allowed `bg-zinc-500/20 text-zinc-400`, failed attempt `bg-red-500/20 text-red-400`), an expandable history (`ChevronDown`), and the action buttons (`Check`, `ShieldOff`, `Undo2`, `Loader2` on the acting row). Table markup copied from `subscriber-panel.tsx`.
- `page.tsx`: make `ClaudeAutomationSection` async; `const unsub = await loadUnsubscribePanel(getDb()).catch(() => null);` render `<div style={{ marginBottom: 20 }}><AxPanel title="Unsubscribe review" kicker={`${unsub?.summary.pending ?? 0} AWAITING`}><UnsubscribePanel initial={unsub} /></AxPanel></div>` above the "Gmail runs" panel.

Commit: `feat(analytics): unsubscribe review panel on the Automation tab`.
