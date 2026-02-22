import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "CryptoFlex LLC";
  const author = searchParams.get("author") || "Chris Johnson";
  const date = searchParams.get("date") || "";
  const tags = searchParams.get("tags")?.split(",").slice(0, 3) || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f0b1a",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #06b6d4, #22d3ee, #67e8f9)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "rgba(6, 182, 212, 0.15)",
                    color: "#22d3ee",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <h1
            style={{
              fontSize: title.length > 60 ? "40px" : "52px",
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "18px" }}>
              {author}
            </span>
            {date && (
              <span style={{ color: "#64748b", fontSize: "16px" }}>
                {date}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#22d3ee",
              letterSpacing: "-0.01em",
            }}
          >
            CryptoFlex LLC
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
