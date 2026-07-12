import type { ReactNode } from "react";
import { Toaster } from "sonner";

type SiteShellProps = {
  children: ReactNode;
  skipLabel: string;
};

export function SiteShell({ children, skipLabel }: SiteShellProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        {skipLabel}
      </a>
      {children}
      <Toaster richColors closeButton />
    </>
  );
}
