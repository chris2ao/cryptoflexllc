import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnsubscribeRow } from "./unsubscribe-row";
import type { UnsubscribePanelRow } from "@/lib/analytics-types";

function row(overrides: Partial<UnsubscribePanelRow> = {}): UnsubscribePanelRow {
  return {
    sender_email: "deals@example.com",
    sender_domain: "example.com",
    method: "rfc8058-post",
    trashed_count_14d: 5,
    first_seen: "2026-08-01T00:00:00.000Z",
    last_seen: "2026-08-15T00:00:00.000Z",
    last_pushed_at: "2026-08-15T00:00:00.000Z",
    decision: null,
    decided_at: null,
    note: null,
    last_attempt: null,
    attempts_since_decision: 0,
    history: [],
    ...overrides,
  };
}

function renderRow(overrides: Partial<UnsubscribePanelRow> = {}) {
  return render(
    <table>
      <tbody>
        <UnsubscribeRow
          row={row(overrides)}
          acting={false}
          expanded={false}
          onToggleHistory={() => {}}
          onDecide={() => {}}
        />
      </tbody>
    </table>
  );
}

describe("UnsubscribeRow: last-attempt column", () => {
  it("shows Failed with the status code when the last attempt did not succeed", () => {
    renderRow({
      last_attempt: {
        attempted_at: "2026-08-15T00:00:00.000Z",
        status_code: 500,
        succeeded: false,
        silent_14d: null,
        silence_measured_at: null,
      },
    });

    expect(screen.getByText("500, Failed")).toBeTruthy();
  });

  it("shows Failed even if silent_14d somehow carries a value on a failed attempt", () => {
    renderRow({
      last_attempt: {
        attempted_at: "2026-08-15T00:00:00.000Z",
        status_code: 403,
        succeeded: false,
        silent_14d: true,
        silence_measured_at: "2026-08-16T00:00:00.000Z",
      },
    });

    expect(screen.getByText("403, Failed")).toBeTruthy();
  });

  it("shows Measuring only when the attempt succeeded and silence is not yet measured", () => {
    renderRow({
      last_attempt: {
        attempted_at: "2026-08-15T00:00:00.000Z",
        status_code: 200,
        succeeded: true,
        silent_14d: null,
        silence_measured_at: null,
      },
    });

    expect(screen.getByText("200, Measuring")).toBeTruthy();
  });

  it("shows Silent for a succeeded attempt with silence confirmed", () => {
    renderRow({
      last_attempt: {
        attempted_at: "2026-08-15T00:00:00.000Z",
        status_code: 200,
        succeeded: true,
        silent_14d: true,
        silence_measured_at: "2026-08-29T00:00:00.000Z",
      },
    });

    expect(screen.getByText("200, Silent")).toBeTruthy();
  });
});
