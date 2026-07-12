"use client";

import { Calculator } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { ScrollRevealArticle } from "@/components/landing/motion-reveal";
import { analyticsEvents } from "@/config/analytics-events";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "@/i18n/navigation";
import type { CampaignSegment } from "@/types/landing";

type RoiCalculatorProps = {
  segment: CampaignSegment;
};

type RoiFieldKey =
  | "activeVendors"
  | "documentsPerVendor"
  | "followUpsPerDocument"
  | "minutesPerFollowUp"
  | "hourlyCost";

type RoiField = {
  key: RoiFieldKey;
  min: number;
  max: number;
  defaultValue: string;
  optional?: boolean;
  inputMode?: "numeric" | "decimal";
};

const fields: RoiField[] = [
  { key: "activeVendors", min: 1, max: 10000, defaultValue: "50" },
  { key: "documentsPerVendor", min: 1, max: 50, defaultValue: "2" },
  { key: "followUpsPerDocument", min: 0, max: 20, defaultValue: "2" },
  { key: "minutesPerFollowUp", min: 1, max: 120, defaultValue: "4" },
  {
    key: "hourlyCost",
    min: 0,
    max: 10000,
    defaultValue: "",
    optional: true,
    inputMode: "decimal"
  }
];

const initialValues = Object.fromEntries(
  fields.map((field) => [field.key, field.defaultValue])
) as Record<RoiFieldKey, string>;

export function RoiCalculator({ segment }: RoiCalculatorProps) {
  const t = useTranslations("landing.roiCalculator");
  const locale = useLocale();
  const pathname = usePathname();
  const [values, setValues] = useState(initialValues);
  const [debouncedValues, setDebouncedValues] = useState(initialValues);
  const changedFields = useRef(new Set<RoiFieldKey>());
  const completionTracked = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValues(values);
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [values]);

  const result = useMemo(() => {
    const activeVendors = clampNumber(debouncedValues.activeVendors, 1, 10000);
    const documentsPerVendor = clampNumber(
      debouncedValues.documentsPerVendor,
      1,
      50
    );
    const followUpsPerDocument = clampNumber(
      debouncedValues.followUpsPerDocument,
      0,
      20
    );
    const minutesPerFollowUp = clampNumber(
      debouncedValues.minutesPerFollowUp,
      1,
      120
    );
    const hourlyCost =
      debouncedValues.hourlyCost.trim() === ""
        ? null
        : clampNumber(debouncedValues.hourlyCost, 0, 10000);
    const monthlyMinutes =
      activeVendors *
      documentsPerVendor *
      followUpsPerDocument *
      minutesPerFollowUp;
    const hours = monthlyMinutes / 60;

    return {
      hours,
      cost: hourlyCost === null ? null : hours * hourlyCost
    };
  }, [debouncedValues]);

  function updateField(key: RoiFieldKey, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));

    if (value !== initialValues[key]) {
      changedFields.current.add(key);
    } else {
      changedFields.current.delete(key);
    }

    if (!completionTracked.current && changedFields.current.size >= 2) {
      completionTracked.current = true;
      trackEvent(analyticsEvents.roiCalculatorCompleted, {
        locale,
        campaign_segment: segment,
        page_path: pathname,
        changed_inputs: changedFields.current.size
      });
    }
  }

  return (
    <ScrollRevealArticle className="mt-10 rounded-lg border border-border bg-surface p-5 shadow-card md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary-subtle text-primary">
          <Calculator aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {t("title")}
          </h3>
          <p className="mt-2 max-w-[62ch] text-sm leading-6 text-foreground-muted">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {fields.map((field) => (
          <label className="grid gap-2" key={field.key}>
            <span className="text-sm font-semibold text-foreground">
              {t(`fields.${field.key}.label`)}
            </span>
            <span className="relative">
              <input
                className="focus-ring h-12 w-full rounded-md border border-input bg-background px-3 pr-12 text-base text-foreground"
                inputMode={field.inputMode ?? "numeric"}
                max={field.max}
                min={field.min}
                onBlur={() => setDebouncedValues(values)}
                onChange={(event) => updateField(field.key, event.target.value)}
                type="number"
                value={values[field.key]}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-foreground-muted">
                {t(`fields.${field.key}.unit`)}
              </span>
            </span>
          </label>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-6 rounded-md border border-primary/20 bg-primary-subtle p-5"
      >
        <p className="text-sm font-semibold text-foreground-muted">
          {t("resultLabel")}
        </p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {t("hoursResult", {
            hours: formatHours(result.hours, locale)
          })}
        </p>
        {result.cost === null ? null : (
          <p className="mt-2 text-base font-semibold text-foreground">
            {t("costResult", {
              cost: formatCurrency(result.cost, locale)
            })}
          </p>
        )}
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-foreground-muted">
          {t("estimateNote")}
        </p>
      </div>
    </ScrollRevealArticle>
  );
}

function clampNumber(value: string, min: number, max: number) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numberValue));
}

function formatHours(hours: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: hours < 10 ? 1 : 0
  }).format(hours);
}

function formatCurrency(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}
