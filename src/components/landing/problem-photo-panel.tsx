"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

type ProblemPhotoPanelProps = {
  alt: string;
  documentChecked: string;
  monitoringActive: string;
  nextCheck: string;
};

const overlayBaseClassName =
  "border border-primary/15 bg-white/94 text-foreground shadow-[0_16px_40px_rgb(15_83_79/0.14)] backdrop-blur-md";

export function ProblemPhotoPanel({
  alt,
  documentChecked,
  monitoringActive,
  nextCheck,
}: ProblemPhotoPanelProps) {
  return (
    <figure className="relative pt-3 pb-12 sm:pt-5 sm:pr-5 sm:pb-14 lg:pt-6 lg:pr-7 lg:pb-16">
      <div
        className={`problem-float-badge ${overlayBaseClassName} absolute top-0 right-0 z-20 inline-flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-bold sm:top-2 sm:right-0 lg:top-1 lg:right-1`}
      >
        <span className="bg-success-subtle flex size-6 items-center justify-center rounded-md">
          <CheckCircle2
            aria-hidden="true"
            className="text-success size-4 shrink-0"
          />
        </span>
        <span>{monitoringActive}</span>
      </div>

      <div className="border-primary/10 bg-surface relative aspect-[16/11] overflow-hidden rounded-xl border shadow-[0_24px_70px_rgb(15_83_79/0.13)]">
        <Image
          alt={alt}
          className="object-cover"
          fill
          sizes="(min-width: 1536px) 52rem, (min-width: 1024px) 58vw, 100vw"
          src="/illustrations/vendor-document-compliance.webp"
        />
        <div
          aria-hidden="true"
          className="from-foreground/15 absolute inset-0 bg-gradient-to-t via-transparent to-white/5"
        />
      </div>

      <div
        className={`problem-float-badge-delayed ${overlayBaseClassName} absolute bottom-0 left-3 z-20 w-[min(19rem,calc(100%-2.5rem))] rounded-xl p-3.5 sm:left-0 sm:w-auto sm:min-w-[18rem] sm:p-4 lg:bottom-2 lg:-left-5 xl:-left-8`}
      >
        <div className="flex items-center gap-2">
          <span className="bg-primary-subtle flex size-7 items-center justify-center rounded-md">
            <CheckCircle2
              aria-hidden="true"
              className="text-primary size-4 shrink-0"
            />
          </span>
          <p className="text-foreground text-sm font-bold">{documentChecked}</p>
        </div>
        <p className="text-foreground-muted mt-1.5 pl-9 text-xs font-semibold">
          {nextCheck}
        </p>
      </div>
    </figure>
  );
}
