import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background: "linear-gradient(135deg, #0b5fff 0%, #6366f1 50%, #8b5cf6 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            🤖
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            Hey AI Hub
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Discover the best AI tools for developers and creators
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "60px",
            marginTop: "50px",
          }}
        >
          {[
            { label: "AI Tools", value: "120+" },
            { label: "Categories", value: "12" },
            { label: "Updated", value: "2026" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "36px", fontWeight: "bold", color: "white" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

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
