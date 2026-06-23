import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Hey AI Hub";
  const type = searchParams.get("type") || "brand";

  // Truncate title for OG image (max ~60 chars)
  const displayTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: type === "blog"
            ? "linear-gradient(135deg, #0b5fff 0%, #6366f1 50%, #8b5cf6 100%)"
            : type === "tool"
              ? "linear-gradient(135deg, #059669 0%, #0b5fff 50%, #6366f1 100%)"
              : "linear-gradient(135deg, #0b5fff 0%, #6366f1 50%, #8b5cf6 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Brand badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🤖
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Hey AI Hub
          </span>
        </div>

        {/* Page type badge */}
        {type !== "brand" && (
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              padding: "4px 16px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {type === "blog" ? "Blog Post" : type === "tool" ? "AI Tool" : type === "best" ? "Best Of" : type === "compare" ? "Comparison" : type}
          </div>
        )}

        {/* Title */}
        <p
          style={{
            fontSize: "44px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.3,
          }}
        >
          {displayTitle}
        </p>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          heyaihub.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
