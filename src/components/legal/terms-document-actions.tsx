"use client";

import { ExternalLink, LinkIcon, Printer } from "lucide-react";
import { useState } from "react";

type TermsDocumentActionsProps = {
  copiedLabel: string;
  copyLabel: string;
  fullPageLabel?: string;
  printLabel: string;
  url: string;
};

export function TermsDocumentActions({
  copiedLabel,
  copyLabel,
  fullPageLabel,
  printLabel,
  url,
}: TermsDocumentActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(
      new URL(url, window.location.origin).href,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="legal-document-actions flex flex-wrap items-center gap-2">
      <button
        className="focus-ring border-border bg-surface text-foreground hover:bg-surface-muted inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors"
        onClick={() => window.print()}
        type="button"
      >
        <Printer aria-hidden="true" className="size-4" />
        {printLabel}
      </button>
      {fullPageLabel ? (
        <a
          className="focus-ring border-border bg-surface text-foreground hover:bg-surface-muted inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink aria-hidden="true" className="size-4" />
          {fullPageLabel}
        </a>
      ) : null}
      <button
        className="focus-ring border-border bg-surface text-foreground hover:bg-surface-muted inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors"
        onClick={copyLink}
        type="button"
      >
        <LinkIcon aria-hidden="true" className="size-4" />
        <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
