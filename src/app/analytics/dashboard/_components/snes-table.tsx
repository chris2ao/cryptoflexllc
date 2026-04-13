import React from "react";

export interface SNESTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface SNESTableProps<T> {
  columns: SNESTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  caption?: string;
}

export function SNESTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "--- NO DATA ---",
  caption,
}: SNESTableProps<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--snes-font-body)",
          fontSize: "var(--snes-text-base)",
        }}
      >
        {caption && (
          <caption
            style={{
              fontFamily: "var(--snes-font-heading)",
              fontSize: "var(--snes-text-xs)",
              color: "var(--snes-text-muted)",
              textAlign: "left",
              paddingBottom: "var(--snes-space-2)",
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr
            style={{
              background: "#0a0930",
              borderBottom: "2px solid var(--snes-border-outer)",
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{
                  fontFamily: "var(--snes-font-heading)",
                  fontSize: "var(--snes-text-xs)",
                  color: "var(--snes-text-muted)",
                  padding: "var(--snes-space-2) var(--snes-space-3)",
                  textAlign: "left",
                  width: col.width,
                  whiteSpace: "nowrap",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  padding: "var(--snes-space-8)",
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-lg)",
                  color: "var(--snes-text-subtle)",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                style={{
                  background: rowIdx % 2 === 0 ? "var(--snes-bg)" : "var(--snes-surface)",
                }}
                className="snes-table-row"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "var(--snes-space-2) var(--snes-space-3)",
                      borderBottom: "1px solid var(--snes-border-dim)",
                      color: "var(--snes-text)",
                      verticalAlign: "middle",
                    }}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{`
        .snes-table-row:hover {
          background: var(--snes-surface-hover) !important;
        }
      `}</style>
    </div>
  );
}
