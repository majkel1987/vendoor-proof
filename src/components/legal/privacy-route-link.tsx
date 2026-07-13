"use client";

import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";

let privacyPolicyOpener: HTMLAnchorElement | null = null;

type PrivacyRouteLinkProps = {
  children: ReactNode;
  className: string;
};

export function PrivacyRouteLink({
  children,
  className,
}: PrivacyRouteLinkProps) {
  return (
    <Link
      className={className}
      href="/privacy"
      onClick={(event) => {
        privacyPolicyOpener = event.currentTarget;
      }}
    >
      {children}
    </Link>
  );
}

export function restorePrivacyPolicyOpener() {
  const opener = privacyPolicyOpener;
  privacyPolicyOpener = null;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
  });
}
