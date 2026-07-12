import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  ariaLabel: string;
  className?: string;
  monochrome?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mark";
};

const sizes = {
  sm: { mark: 30, text: "text-sm" },
  md: { mark: 36, text: "text-[1rem]" },
  lg: { mark: 42, text: "text-lg" },
} as const;

export function BrandLogo({
  ariaLabel,
  className,
  monochrome = false,
  size = "md",
  variant = "full",
}: BrandLogoProps) {
  const dimensions = sizes[size];

  return (
    <span
      aria-label={ariaLabel}
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
      role="img"
    >
      <BrandMark monochrome={monochrome} size={dimensions.mark} />
      {variant === "full" ? (
        <span
          className={cn(
            "text-foreground leading-none font-extrabold tracking-[-0.035em] whitespace-nowrap",
            dimensions.text,
          )}
        >
          {ariaLabel}
        </span>
      ) : null}
    </span>
  );
}

export function BrandMark({
  className,
  monochrome = false,
  size = 36,
  style,
}: {
  className?: string;
  monochrome?: boolean;
  size?: number;
  style?: CSSProperties;
}) {
  const teal = monochrome ? "currentColor" : "#08706b";
  const navy = monochrome ? "currentColor" : "#172033";

  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0", className)}
      fill="none"
      height={size}
      style={style}
      viewBox="0 0 40 40"
      width={size}
    >
      <rect
        fill={monochrome ? "none" : "#e7f6f3"}
        height="38"
        rx="11"
        stroke={monochrome ? "currentColor" : "#b8e2dc"}
        width="38"
        x="1"
        y="1"
      />
      <path
        d="M22.5 11.5v17M22.5 12h5.25c3.65 0 6 2.15 6 5.35s-2.35 5.4-6 5.4H23"
        stroke={navy}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        d="m7.75 13.25 8.1 15 8.65-16"
        stroke={teal}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.8"
      />
    </svg>
  );
}
