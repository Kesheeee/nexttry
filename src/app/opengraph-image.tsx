import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "NextTry — Your next step, at every stage of life.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(path.join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "radial-gradient(70% 55% at 10% 5%, rgba(232,98,77,0.32), transparent 70%), radial-gradient(60% 55% at 95% 0%, rgba(91,75,224,0.26), transparent 70%), radial-gradient(80% 70% at 50% 110%, rgba(232,154,30,0.36), transparent 70%), #f6f2ed",
          color: "#15110e",
        }}
      >
        {/* Top: logo + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logoSrc} alt="NextTry" height={56} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(21,17,14,0.55)",
              fontFamily: "monospace",
            }}
          >
            <div style={{ width: 36, height: 2, background: "rgba(21,17,14,0.55)" }} />
            Mentorship for every chapter
          </div>
        </div>

        {/* Middle: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 100,
            fontWeight: 600,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: "#15110e",
          }}
        >
          <div style={{ display: "flex" }}>
            Your <span style={{ color: "#E8624D", marginLeft: 26 }}>next step,</span>
          </div>
          <div>at every stage of life.</div>
        </div>

        {/* Bottom: domain + product names */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#15110e",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "rgba(21,17,14,0.6)", fontSize: 20 }}>hknexttry.com</span>
          <div
            style={{
              display: "flex",
              gap: 22,
              fontSize: 18,
              color: "rgba(21,17,14,0.65)",
              fontFamily: "monospace",
              letterSpacing: "0.12em",
            }}
          >
            <span>nCall</span>
            <span style={{ color: "rgba(21,17,14,0.3)" }}>·</span>
            <span>PODCAST</span>
            <span style={{ color: "rgba(21,17,14,0.3)" }}>·</span>
            <span>nSpace</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
