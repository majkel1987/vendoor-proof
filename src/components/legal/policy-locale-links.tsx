import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type PolicyLocaleLinksProps = {
  locale: Locale;
  label: string;
  path?: "/privacy" | "/terms";
};

export function PolicyLocaleLinks({
  locale,
  label,
  path = "/privacy",
}: PolicyLocaleLinksProps) {
  return (
    <nav
      aria-label={label}
      className="border-border bg-surface-muted/70 flex items-center gap-1 rounded-lg border p-1"
    >
      {(["en", "pl"] as const).map((targetLocale) => (
        <Link
          aria-current={targetLocale === locale ? "page" : undefined}
          className={cn(
            "focus-ring min-w-10 rounded-md px-2.5 py-1.5 text-center text-xs font-bold transition-colors",
            targetLocale === locale
              ? "bg-primary text-primary-foreground"
              : "text-foreground-muted hover:bg-surface hover:text-foreground",
          )}
          href={path}
          key={targetLocale}
          locale={targetLocale}
        >
          {targetLocale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
