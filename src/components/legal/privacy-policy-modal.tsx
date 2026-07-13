"use client";

import { X } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

import { PolicyLocaleLinks } from "@/components/legal/policy-locale-links";
import { restorePrivacyPolicyOpener } from "@/components/legal/privacy-route-link";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type PrivacyPolicyModalProps = {
  children: ReactNode;
  closeLabel: string;
  languageLabel: string;
  locale: Locale;
  title: string;
  updated: string;
};

export function PrivacyPolicyModal({
  children,
  closeLabel,
  languageLabel,
  locale,
  title,
  updated,
}: PrivacyPolicyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      restorePrivacyPolicyOpener();
    };
  }, []);

  const close = () => router.back();
  const handleBackdrop = (event: PointerEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  return (
    <dialog
      aria-labelledby="privacy-policy-modal-title"
      aria-modal="true"
      className="text-foreground m-auto max-h-none w-[min(920px,calc(100vw-32px))] max-w-none overflow-visible rounded-[1.5rem] bg-transparent p-0 shadow-[0_28px_100px_rgb(7_44_39/0.22)] backdrop:bg-[rgb(10_32_30/0.54)] backdrop:backdrop-blur-[2px]"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onPointerDown={handleBackdrop}
      ref={dialogRef}
    >
      <div className="border-border bg-surface flex max-h-[85dvh] min-h-0 flex-col overflow-hidden rounded-[1.5rem] border ring-1 ring-white/70">
        <header className="border-border bg-surface/95 z-10 flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 backdrop-blur md:px-8 md:py-5">
          <div className="min-w-0">
            <h1
              className="text-foreground text-xl font-semibold tracking-[-0.01em] outline-none md:text-2xl"
              id="privacy-policy-modal-title"
              tabIndex={-1}
            >
              {title}
            </h1>
            <p className="text-foreground-muted mt-1 text-xs font-medium md:text-sm">
              {updated}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <PolicyLocaleLinks label={languageLabel} locale={locale} />
            <button
              className="focus-ring border-border bg-surface text-foreground hover:bg-surface-muted inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-[background-color,transform] active:translate-y-px"
              onClick={close}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">{closeLabel}</span>
              <span className="sr-only sm:hidden">{closeLabel}</span>
            </button>
          </div>
        </header>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 md:px-9 md:py-8">
          {children}
        </div>
      </div>
    </dialog>
  );
}
