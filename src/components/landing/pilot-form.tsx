"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  useForm,
  type FieldError,
  type Path,
  type Resolver
} from "react-hook-form";
import { z } from "zod";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/config/analytics-events";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";
import type { CampaignConfig } from "@/types/landing";

type PilotFormProps = {
  campaign: CampaignConfig;
};

type SubmissionPhase = "idle" | "submitting" | "success" | "error";

type FormValues = {
  firstName?: string;
  workEmail: string;
  company: string;
  role?: string;
  companyType: (typeof companyTypeOptions)[number];
  activeVendors: (typeof activeVendorOptions)[number];
  currentProcess: (typeof currentProcessOptions)[number];
  monthlyFollowUps?: string;
  biggestPain?: string;
  privacyConsent: boolean;
  campaignSegment: CampaignConfig["segment"];
  locale: Locale;
  honeypot?: string;
};

const companyTypeOptions = [
  "Property management",
  "General contractor",
  "Facilities",
  "Other"
] as const;

const activeVendorOptions = ["1-25", "26-100", "101-250", "250+"] as const;

const currentProcessOptions = [
  "Spreadsheet",
  "Shared drive",
  "Existing software",
  "Other"
] as const;

const formPanelItems = [
  "statusView",
  "manualFollowUp",
  "vendorUpload",
  "auditTrail"
] as const;

const budgetOptionKeys = [
  "under100",
  "100to249",
  "250to499",
  "500to999",
  "1000plus"
] as const;

export function PilotForm({ campaign }: PilotFormProps) {
  const t = useTranslations("landing.pilotForm");
  const offerT = useTranslations("landing.betaOffer");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startedTracked = useRef(false);
  const [submissionPhase, setSubmissionPhase] = useState<SubmissionPhase>("idle");
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = createLeadFormSchema({
    required: t("errors.required"),
    email: t("errors.email"),
    min2: t("errors.min2"),
    max80: t("errors.max80"),
    max100: t("errors.max100"),
    max120: t("errors.max120"),
    max800: t("errors.max800"),
    consent: t("errors.consent")
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      workEmail: "",
      company: "",
      role: "",
      companyType: campaign.formDefaults.companyType,
      activeVendors: "26-100",
      currentProcess: "Spreadsheet",
      monthlyFollowUps: "Not sure",
      biggestPain: "",
      privacyConsent: false,
      honeypot: "",
      campaignSegment: campaign.segment,
      locale
    }
  });

  const workEmail = watch("workEmail");

  function trackStarted() {
    if (startedTracked.current) {
      return;
    }

    startedTracked.current = true;
    trackEvent(analyticsEvents.pilotFormStarted, {
      locale,
      campaign_segment: campaign.segment,
      page_path: pathname
    });
  }

  function handleFormInteraction() {
    if (submissionPhase === "error") {
      setSubmissionPhase("idle");
      setSubmitError(null);
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setSubmissionPhase("submitting");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          ...values,
          source: pathname,
          referrer: document.referrer,
          utmSource: searchParams.get("utm_source") ?? undefined,
          utmMedium: searchParams.get("utm_medium") ?? undefined,
          utmCampaign: searchParams.get("utm_campaign") ?? undefined,
          utmContent: searchParams.get("utm_content") ?? undefined,
          utmTerm: searchParams.get("utm_term") ?? undefined
        })
      });

      let payload: { ok?: boolean } | null = null;

      try {
        payload = (await response.json()) as { ok?: boolean };
      } catch {
        payload = null;
      }

      if (!response.ok || payload?.ok !== true) {
        setSubmissionPhase("error");
        setSubmitError(t("errors.submit"));
        trackEvent(analyticsEvents.pilotFormFailed, {
          locale,
          campaign_segment: campaign.segment,
          page_path: pathname,
          status: response.ok ? "invalid_response" : response.status
        });
        return;
      }

      trackEvent(analyticsEvents.pilotFormSubmitted, {
        locale,
        campaign_segment: campaign.segment,
        page_path: pathname
      });
      setSuccessEmail(values.workEmail);
      setSubmissionPhase("success");
    } catch {
      setSubmissionPhase("error");
      setSubmitError(t("errors.network"));
      trackEvent(analyticsEvents.pilotFormFailed, {
        locale,
        campaign_segment: campaign.segment,
        page_path: pathname,
        status: "network_error"
      });
    }
  }

  function onInvalid() {
    setSubmissionPhase("error");
    setSubmitError(t("errors.invalid"));
    trackEvent(analyticsEvents.pilotFormFailed, {
      locale,
      campaign_segment: campaign.segment,
      page_path: pathname,
      status: "client_validation"
    });
  }

  if (submissionPhase === "success" && successEmail) {
    return (
      <PilotSuccess
        campaign={campaign}
        email={successEmail}
        locale={locale}
        searchParams={searchParams}
      />
    );
  }

  return (
    <section
      aria-labelledby="pilot-form-heading"
      className="border-border scroll-mt-28 border-b bg-surface py-16 md:py-24"
      id="pilot-form"
    >
      <Container className="max-w-[88rem]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-stretch">
          <aside className="relative overflow-hidden rounded-lg border border-primary/20 bg-primary-subtle p-6 shadow-card md:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-primary/35 via-white/70 to-transparent"
            />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex size-12 items-center justify-center rounded-md bg-surface text-primary shadow-card">
                <CalendarDays aria-hidden="true" className="size-6" />
              </div>
              <p className="mt-8 text-sm leading-6 font-bold tracking-[0.1em] text-primary uppercase">
                {offerT("title")}
              </p>
              <h2 className="mt-3 text-3xl leading-[1.05] font-semibold text-foreground text-balance md:text-4xl">
                {offerT("cta.title")}
              </h2>
              <p className="mt-5 max-w-[38rem] text-base leading-7 text-foreground-muted">
                {offerT("cta.copy")}
              </p>

              <div className="mt-8 rounded-lg border border-primary/15 bg-surface/72 p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {offerT("scope.title")}
                </h3>
                <ul className="mt-4 grid gap-3">
                  {formPanelItems.map((item) => (
                    <li className="flex gap-3 text-sm leading-6" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 text-primary"
                      />
                      <span className="text-foreground-muted">
                        {offerT(`scope.items.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-auto pt-8 text-sm leading-6 font-semibold text-foreground-muted">
                {offerT("cta.microcopy")}
              </p>
            </div>
          </aside>

          <form
            className="grid gap-5 rounded-lg border border-border bg-background p-5 shadow-card md:grid-cols-2 md:p-6 lg:p-8"
            noValidate
            onFocusCapture={() => {
              handleFormInteraction();
              trackStarted();
            }}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            <div className="md:col-span-2">
              <h2
                className="text-3xl leading-[1.08] font-semibold text-foreground md:text-4xl"
                id="pilot-form-heading"
              >
                {t("title")}
              </h2>
              <p className="mt-3 max-w-[62ch] text-base leading-7 text-foreground-muted">
                {t("lead")}
              </p>
            </div>

          <FormField
            error={errors.workEmail}
            label={t("fields.workEmail.label")}
            name="workEmail"
          >
            <input
              {...register("workEmail", {
                onBlur: () => {
                  if (workEmail) {
                    trackEvent(analyticsEvents.leadEmailEntered, {
                      locale,
                      campaign_segment: campaign.segment,
                      page_path: pathname
                    });
                  }
                }
              })}
              aria-describedby={fieldDescription("workEmail", errors.workEmail)}
              aria-invalid={Boolean(errors.workEmail)}
              className={inputClassName}
              id="workEmail"
              placeholder={t("fields.workEmail.placeholder")}
              type="email"
            />
          </FormField>

          <FormField
            error={errors.company}
            label={t("fields.company.label")}
            name="company"
          >
            <input
              {...register("company")}
              aria-describedby={fieldDescription("company", errors.company)}
              aria-invalid={Boolean(errors.company)}
              className={inputClassName}
              id="company"
              placeholder={t("fields.company.placeholder")}
              type="text"
            />
          </FormField>

          <FormField
            error={errors.companyType}
            label={t("fields.companyType.label")}
            name="companyType"
          >
            <select
              {...register("companyType", {
                onChange: (event) => {
                  trackEvent(analyticsEvents.companyTypeSelected, {
                    locale,
                    campaign_segment: campaign.segment,
                    page_path: pathname,
                    value: event.target.value
                  });
                }
              })}
              aria-describedby={fieldDescription("companyType", errors.companyType)}
              aria-invalid={Boolean(errors.companyType)}
              className={inputClassName}
              id="companyType"
            >
              {companyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`options.companyType.${option}`)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            error={errors.activeVendors}
            label={t("fields.activeVendors.label")}
            name="activeVendors"
          >
            <select
              {...register("activeVendors", {
                onChange: (event) => {
                  trackEvent(analyticsEvents.vendorVolumeSelected, {
                    locale,
                    campaign_segment: campaign.segment,
                    page_path: pathname,
                    value: event.target.value
                  });
                }
              })}
              aria-describedby={fieldDescription(
                "activeVendors",
                errors.activeVendors
              )}
              aria-invalid={Boolean(errors.activeVendors)}
              className={inputClassName}
              id="activeVendors"
            >
              {activeVendorOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`options.activeVendors.${option}`)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            error={errors.currentProcess}
            label={t("fields.currentProcess.label")}
            name="currentProcess"
          >
            <select
              {...register("currentProcess", {
                onChange: (event) => {
                  trackEvent(analyticsEvents.currentProcessSelected, {
                    locale,
                    campaign_segment: campaign.segment,
                    page_path: pathname,
                    value: event.target.value
                  });
                }
              })}
              aria-describedby={fieldDescription(
                "currentProcess",
                errors.currentProcess
              )}
              aria-invalid={Boolean(errors.currentProcess)}
              className={inputClassName}
              id="currentProcess"
            >
              {currentProcessOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`options.currentProcess.${option}`)}
                </option>
              ))}
            </select>
          </FormField>

          <div className="absolute top-auto left-[-10000px] h-px w-px overflow-hidden">
            <input
              {...register("honeypot")}
              aria-label={t("fields.honeypot.label")}
              autoComplete="off"
              id="companyWebsite"
              tabIndex={-1}
              type="text"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-start gap-3 text-sm leading-6 text-foreground-muted">
              <input
                {...register("privacyConsent")}
                aria-describedby={fieldDescription(
                  "privacyConsent",
                  errors.privacyConsent
                )}
                aria-invalid={Boolean(errors.privacyConsent)}
                className="focus-ring mt-1 size-4 rounded border-input"
                type="checkbox"
              />
              <span>{t("fields.privacyConsent.label")}</span>
            </label>
            <FieldErrorMessage error={errors.privacyConsent} name="privacyConsent" />
          </div>

          <input type="hidden" {...register("campaignSegment")} />
          <input type="hidden" {...register("locale")} />

          {submitError ? (
            <p
              aria-live="assertive"
              className="rounded-md border border-destructive/25 bg-surface px-4 py-3 text-sm font-semibold text-destructive md:col-span-2"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}

          <Button
            aria-busy={submissionPhase === "submitting"}
            className="w-full md:col-span-2"
            disabled={isSubmitting || submissionPhase === "submitting"}
            size="lg"
            type="submit"
          >
            {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
            {t("submit")}
          </Button>

          <p className="text-sm leading-6 text-foreground-muted md:col-span-2">
            {t("privacyPrefix")}{" "}
            <Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/privacy">
              {t("privacyLink")}
            </Link>
            .
          </p>
          </form>
        </div>
      </Container>
    </section>
  );
}

function PilotSuccess({
  campaign,
  email,
  locale,
  searchParams
}: {
  campaign: CampaignConfig;
  email: string;
  locale: string;
  searchParams: URLSearchParams;
}) {
  const t = useTranslations("landing.pilotForm.success");
  const pathname = usePathname();
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const calendarUrl = buildCalendarUrl({
    email,
    locale,
    campaign: campaign.segment,
    searchParams
  });

  useEffect(() => {
    trackEvent(analyticsEvents.pricingQuestionViewed, {
      locale,
      campaign_segment: campaign.segment,
      page_path: pathname
    });

    document.getElementById("pilot-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [campaign.segment, locale, pathname]);

  function selectBudget(option: (typeof budgetOptionKeys)[number]) {
    setSelectedBudget(option);
    trackEvent(analyticsEvents.pricingQuestionAnswered, {
      locale,
      campaign_segment: campaign.segment,
      page_path: pathname,
      value: t(`budget.options.${option}`)
    });
  }

  return (
    <section
      aria-labelledby="pilot-form-heading"
      aria-live="polite"
      className="scroll-mt-28 bg-surface py-16 md:py-24"
      id="pilot-form"
      role="status"
    >
      <Container className="max-w-[54rem]">
        <div className="rounded-lg border border-primary/20 bg-primary-subtle p-6 shadow-card md:p-8">
          <p className="text-sm font-semibold tracking-[0.08em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h2
            className="mt-4 text-3xl leading-[1.08] font-semibold text-foreground md:text-5xl"
            id="pilot-form-heading"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-7 text-foreground-muted">
            {t("copy")}
          </p>
          <div className="mt-7 rounded-lg border border-primary/15 bg-surface/72 p-4">
            <h3 className="text-base font-semibold text-foreground">
              {t("budget.title")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              {t("budget.copy")}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {budgetOptionKeys.map((option) => (
                <button
                  aria-pressed={selectedBudget === option}
                  className={`focus-ring rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                    selectedBudget === option
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                  key={option}
                  onClick={() => selectBudget(option)}
                  type="button"
                >
                  {t(`budget.options.${option}`)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-foreground-muted">
              {t("budget.note")}
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a
                href={calendarUrl}
                onClick={() => {
                  trackEvent(analyticsEvents.callBooked, {
                    locale,
                    campaign_segment: campaign.segment,
                    page_path: pathname
                  });
                }}
                rel="noreferrer"
                target="_blank"
              >
                {t("calendarCta")}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#workflow">{t("productCta")}</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FormField({
  children,
  className,
  error,
  label,
  name
}: {
  children: ReactNode;
  className?: string;
  error?: FieldError;
  label: string;
  name: Path<FormValues>;
}) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <label className="text-sm font-semibold text-foreground" htmlFor={name}>
        {label}
      </label>
      {children}
      <FieldErrorMessage error={error} name={name} />
    </div>
  );
}

function FieldErrorMessage({
  error,
  name
}: {
  error?: FieldError;
  name: string;
}) {
  if (!error?.message) {
    return null;
  }

  return (
    <p className="text-sm font-semibold text-destructive" id={`${name}-error`}>
      {error.message}
    </p>
  );
}

function fieldDescription(name: string, error?: FieldError) {
  return error ? `${name}-error` : undefined;
}

function createLeadFormSchema(messages: {
  required: string;
  email: string;
  min2: string;
  max80: string;
  max100: string;
  max120: string;
  max800: string;
  consent: string;
}) {
  return z.object({
    firstName: z.string().trim().max(80, messages.max80).optional(),
    workEmail: z
      .string()
      .trim()
      .min(1, messages.required)
      .email(messages.email)
      .max(254, messages.email),
    company: z
      .string()
      .trim()
      .min(2, messages.min2)
      .max(120, messages.max120),
    role: z.string().trim().max(100, messages.max100).optional(),
    companyType: z.enum(companyTypeOptions),
    activeVendors: z.enum(activeVendorOptions),
    currentProcess: z.enum(currentProcessOptions),
    monthlyFollowUps: z.string().trim().max(40).optional(),
    biggestPain: z.string().trim().max(800, messages.max800).optional(),
    privacyConsent: z.boolean().refine(Boolean, messages.consent),
    campaignSegment: z.enum(["property-management", "contractors"]),
    locale: z.enum(["en", "pl"]),
    honeypot: z.string().max(0).optional()
  });
}

const inputClassName =
  "focus-ring h-12 w-full rounded-md border border-input bg-surface px-3 text-base text-foreground";

function buildCalendarUrl({
  campaign,
  email,
  locale,
  searchParams
}: {
  campaign: string;
  email: string;
  locale: string;
  searchParams: Pick<URLSearchParams, "get">;
}) {
  const calendarBase =
    process.env.NEXT_PUBLIC_CALENDAR_URL ??
    "https://calendly.com/coi-tracker/workflow-call";
  const url = new URL(calendarBase);

  url.searchParams.set("email", email);
  url.searchParams.set("locale", locale);
  url.searchParams.set("campaign", campaign);

  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
  ]) {
    const value = searchParams.get(key);

    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}
