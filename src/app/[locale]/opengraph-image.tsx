import { ImageResponse } from "next/og";

import { BrandMark } from "@/components/shared/brand-logo";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f7f9fb",
        color: "#172033",
        padding: 72,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        <BrandMark size={56} style={{ marginRight: 18 }} />
        {siteConfig.name}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            maxWidth: 880,
            fontSize: 64,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          Vendor document follow-ups without manual chasing
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#45606a",
          }}
        >
          Submitted or received does not mean verified.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: 24,
          color: "#226b68",
        }}
      >
        <span>Detect</span>
        <span>Follow up</span>
        <span>Route to review</span>
        <span>Escalate exceptions</span>
      </div>
    </div>,
    size,
  );
}
