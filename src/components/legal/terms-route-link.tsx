"use client";

import type { ReactNode } from "react";

import { Link, usePathname } from "@/i18n/navigation";

let termsOpener: HTMLAnchorElement | null = null;

export function TermsRouteLink({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      aria-current={pathname === "/terms" ? "page" : undefined}
      className={className}
      href="/terms"
      onClick={(event) => {
        termsOpener = event.currentTarget;
      }}
    >
      {children}
    </Link>
  );
}

export function restoreTermsOpener() {
  const opener = termsOpener;
  termsOpener = null;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
  });
}
