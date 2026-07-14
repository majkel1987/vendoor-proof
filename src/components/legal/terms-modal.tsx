"use client";

import { X } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

import { PolicyLocaleLinks } from "@/components/legal/policy-locale-links";
import { TermsDocumentActions } from "@/components/legal/terms-document-actions";
import { restoreTermsOpener } from "@/components/legal/terms-route-link";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type TermsModalProps = {
  children: ReactNode;
  closeLabel: string;
  copiedLabel: string;
  copyLabel: string;
  fullPageLabel: string;
  languageLabel: string;
  locale: Locale;
  printLabel: string;
  statusLabel: string;
  title: string;
  url: string;
};

export function TermsModal({
  children,
  closeLabel,
  copiedLabel,
  copyLabel,
  fullPageLabel,
  languageLabel,
  locale,
  printLabel,
  statusLabel,
  title,
  url,
}: TermsModalProps) {
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
      restoreTermsOpener();
    };
  }, []);

  const close = () => router.back();

  return (
    <dialog
      aria-labelledby="terms-modal-title"
      aria-modal="true"
      className="legal-document-dialog text-foreground m-auto max-h-none w-[min(960px,calc(100vw-32px))] max-w-none overflow-visible rounded-[1.5rem] bg-transparent p-0 shadow-[0_28px_100px_rgb(7_44_39/0.22)] backdrop:bg-[rgb(10_32_30/0.54)] backdrop:backdrop-blur-[2px]"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onPointerDown={(event: PointerEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
      ref={dialogRef}
    >
      <div className="border-border bg-surface flex max-h-[88dvh] min-h-0 flex-col overflow-hidden rounded-[1.5rem] border ring-1 ring-white/70">
        <header className="legal-document-header border-border bg-surface/95 z-10 shrink-0 border-b px-5 py-4 backdrop-blur md:px-8 md:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1
                className="text-foreground text-xl font-semibold tracking-[-0.01em] outline-none md:text-2xl"
                id="terms-modal-title"
                tabIndex={-1}
              >
                {title}
              </h1>
              <p className="text-foreground-muted mt-1 text-xs font-medium md:text-sm">
                {statusLabel}
              </p>
            </div>
            <button
              aria-label={closeLabel}
              className="legal-document-close focus-ring border-border bg-surface text-foreground hover:bg-surface-muted inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors"
              onClick={close}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">{closeLabel}</span>
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <TermsDocumentActions
              copiedLabel={copiedLabel}
              copyLabel={copyLabel}
              fullPageLabel={fullPageLabel}
              printLabel={printLabel}
              url={url}
            />
            <div className="legal-document-navigation">
              <PolicyLocaleLinks
                label={languageLabel}
                locale={locale}
                path="/terms"
              />
            </div>
          </div>
        </header>
        <div className="legal-document-body min-h-0 overflow-y-auto overscroll-contain px-5 py-6 md:px-10 md:py-8">
          {children}
        </div>
      </div>
    </dialog>
  );
}
