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
  const teal = monochrome ? "currentColor" : "#087b76";
  const navy = monochrome ? "currentColor" : "#132239";
  const cutout = monochrome ? "var(--background, white)" : "white";

  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0", className)}
      fill="none"
      height={size}
      style={style}
      viewBox="0 0 100 100"
      width={size}
    >
      <path d="M4 8h26.5L50 49 70.5 8H93L59.5 92h-20L4 8Z" fill={teal} />
      <path
        d="M50 8h23.5C88 8 98 18.7 98 35.5S88 63 73.5 63H69v29H50V8Zm19 18v19h4.5c4.2 0 7.5-3.5 7.5-9.5S77.7 26 73.5 26H69Z"
        fill={navy}
        fillRule="evenodd"
      />
      <path d="M50 8h11v39.5l-7-7-7 7V28.5L50 25V8Z" fill={teal} />
      <path
        d="m36 40.5 14 14 25-28"
        stroke={cutout}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9"
      />
    </svg>
  );
}
