"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  useForm,
  type FieldError,
  type Path,
  type Resolver,
} from "react-hook-form";
import { z } from "zod";

import { PrivacyRouteLink } from "@/components/legal/privacy-route-link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/config/analytics-events";
import { usePathname } from "@/i18n/navigation";
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
  monthlyFollowUps?: (typeof monthlyFollowUpOptions)[number];
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
  "Other",
] as const;

const activeVendorOptions = ["1-25", "26-100", "101-250", "250+"] as const;

const currentProcessOptions = [
  "Spreadsheet",
  "Shared drive",
  "Existing software",
  "Other",
] as const;

const monthlyFollowUpOptions = [
  "1-10",
  "11-25",
  "26-50",
  "50+",
  "Not sure",
] as const;

const formPanelItems = [
  "statusView",
  "manualFollowUp",
  "vendorUpload",
  "auditTrail",
] as const;

export function PilotForm({ campaign }: PilotFormProps) {
  const t = useTranslations("landing.pilotForm");
  const offerT = useTranslations("landing.betaOffer");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startedTracked = useRef(false);
  const [submissionPhase, setSubmissionPhase] =
    useState<SubmissionPhase>("idle");
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
    consent: t("errors.consent"),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
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
      locale,
    },
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
      page_path: pathname,
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
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          source: pathname,
          referrer: document.referrer,
          utmSource: searchParams.get("utm_source") ?? undefined,
          utmMedium: searchParams.get("utm_medium") ?? undefined,
          utmCampaign: searchParams.get("utm_campaign") ?? undefined,
          utmContent: searchParams.get("utm_content") ?? undefined,
          utmTerm: searchParams.get("utm_term") ?? undefined,
        }),
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
          status: response.ok ? "invalid_response" : response.status,
        });
        return;
      }

      trackEvent(analyticsEvents.pilotFormSubmitted, {
        locale,
        campaign_segment: campaign.segment,
        page_path: pathname,
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
        status: "network_error",
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
      status: "client_validation",
    });
  }

  if (submissionPhase === "success" && successEmail) {
    return <PilotSuccess />;
  }

  return (
    <section
      aria-labelledby="pilot-form-heading"
      className="section-shell border-border bg-surface scroll-mt-28 border-b"
      id="pilot-form"
    >
      <Container className="max-w-[88rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-stretch lg:gap-6">
          <aside className="border-primary/20 bg-primary-subtle shadow-card relative overflow-hidden rounded-lg border p-5 md:p-7 lg:p-8">
            <div
              aria-hidden="true"
              className="bg-primary/10 absolute -right-20 -bottom-24 size-72 rounded-full blur-3xl"
            />
            <div
              aria-hidden="true"
              className="from-primary/35 absolute top-0 left-0 h-px w-full bg-gradient-to-r via-white/70 to-transparent"
            />
            <div className="relative z-10 flex h-full flex-col">
              <div className="bg-surface text-primary shadow-card flex size-11 items-center justify-center rounded-md">
                <CalendarDays aria-hidden="true" className="size-5" />
              </div>
              <p className="text-primary mt-6 text-xs leading-5 font-bold tracking-[0.1em] uppercase">
                {offerT("title")}
              </p>
              <h2 className="text-foreground mt-2 text-2xl leading-tight font-semibold text-balance md:text-3xl">
                {offerT("cta.title")}
              </h2>
              <p className="text-foreground-muted mt-3 max-w-[38rem] text-sm leading-6">
                {offerT("cta.copy")}
              </p>

              <div className="border-primary/15 bg-surface/72 mt-6 rounded-lg border p-3.5">
                <h3 className="text-foreground text-sm font-semibold">
                  {offerT("scope.title")}
                </h3>
                <ul className="mt-3 grid gap-2.5">
                  {formPanelItems.map((item) => (
                    <li className="flex gap-2.5 text-sm leading-5" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="text-primary mt-0.5 size-4 shrink-0"
                      />
                      <span className="text-foreground-muted">
                        {offerT(`scope.items.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-foreground-muted mt-auto pt-6 text-sm leading-5 font-semibold">
                {offerT("cta.microcopy")}
              </p>
            </div>
          </aside>

          <form
            className="border-border bg-background shadow-card grid gap-3 rounded-lg border p-4 sm:grid-cols-2 md:gap-3.5 md:p-5 lg:p-6"
            noValidate
            onFocusCapture={() => {
              handleFormInteraction();
              trackStarted();
            }}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            <div className="sm:col-span-2">
              <h2
                className="text-foreground text-2xl leading-tight font-semibold md:text-3xl"
                id="pilot-form-heading"
              >
                {t("title")}
              </h2>
              <p className="text-foreground-muted mt-2 max-w-[62ch] text-sm leading-6">
                {t("lead")}
              </p>
            </div>

            <FormField
              error={errors.firstName}
              label={t("fields.firstName.label")}
              name="firstName"
            >
              <input
                {...register("firstName")}
                aria-describedby={fieldDescription(
                  "firstName",
                  errors.firstName,
                )}
                aria-invalid={Boolean(errors.firstName)}
                autoComplete="given-name"
                className={inputClassName}
                id="firstName"
                placeholder={t("fields.firstName.placeholder")}
                suppressHydrationWarning
                type="text"
              />
            </FormField>

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
                        page_path: pathname,
                      });
                    }
                  },
                })}
                aria-describedby={fieldDescription(
                  "workEmail",
                  errors.workEmail,
                )}
                aria-invalid={Boolean(errors.workEmail)}
                autoComplete="email"
                className={inputClassName}
                data-anchor-focus
                id="workEmail"
                placeholder={t("fields.workEmail.placeholder")}
                suppressHydrationWarning
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
                autoComplete="organization"
                className={inputClassName}
                id="company"
                placeholder={t("fields.company.placeholder")}
                suppressHydrationWarning
                type="text"
              />
            </FormField>

            <FormField
              error={errors.role}
              label={t("fields.role.label")}
              name="role"
            >
              <input
                {...register("role")}
                aria-describedby={fieldDescription("role", errors.role)}
                aria-invalid={Boolean(errors.role)}
                autoComplete="organization-title"
                className={inputClassName}
                id="role"
                placeholder={t("fields.role.placeholder")}
                suppressHydrationWarning
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
                      value: event.target.value,
                    });
                  },
                })}
                aria-describedby={fieldDescription(
                  "companyType",
                  errors.companyType,
                )}
                aria-invalid={Boolean(errors.companyType)}
                className={inputClassName}
                id="companyType"
                suppressHydrationWarning
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
                      value: event.target.value,
                    });
                  },
                })}
                aria-describedby={fieldDescription(
                  "activeVendors",
                  errors.activeVendors,
                )}
                aria-invalid={Boolean(errors.activeVendors)}
                className={inputClassName}
                id="activeVendors"
                suppressHydrationWarning
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
                      value: event.target.value,
                    });
                  },
                })}
                aria-describedby={fieldDescription(
                  "currentProcess",
                  errors.currentProcess,
                )}
                aria-invalid={Boolean(errors.currentProcess)}
                className={inputClassName}
                id="currentProcess"
                suppressHydrationWarning
              >
                {currentProcessOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.currentProcess.${option}`)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              error={errors.monthlyFollowUps}
              label={t("fields.monthlyFollowUps.label")}
              name="monthlyFollowUps"
            >
              <select
                {...register("monthlyFollowUps")}
                aria-describedby={fieldDescription(
                  "monthlyFollowUps",
                  errors.monthlyFollowUps,
                )}
                aria-invalid={Boolean(errors.monthlyFollowUps)}
                className={inputClassName}
                id="monthlyFollowUps"
                suppressHydrationWarning
              >
                {monthlyFollowUpOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`options.monthlyFollowUps.${option}`)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              className="sm:col-span-2"
              error={errors.biggestPain}
              label={t("fields.biggestPain.label")}
              name="biggestPain"
            >
              <textarea
                {...register("biggestPain")}
                aria-describedby={fieldDescription(
                  "biggestPain",
                  errors.biggestPain,
                )}
                aria-invalid={Boolean(errors.biggestPain)}
                className={`${inputClassName} min-h-[88px] resize-y py-2.5`}
                id="biggestPain"
                placeholder={t("fields.biggestPain.placeholder")}
                rows={3}
                suppressHydrationWarning
              />
            </FormField>

            <div className="absolute top-auto left-[-10000px] h-px w-px overflow-hidden">
              <input
                {...register("honeypot")}
                aria-label={t("fields.honeypot.label")}
                autoComplete="off"
                id="companyWebsite"
                suppressHydrationWarning
                tabIndex={-1}
                type="text"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-foreground-muted flex items-start gap-2.5 text-sm leading-5">
                <input
                  {...register("privacyConsent")}
                  aria-describedby={fieldDescription(
                    "privacyConsent",
                    errors.privacyConsent,
                  )}
                  aria-invalid={Boolean(errors.privacyConsent)}
                  className="focus-ring border-input mt-0.5 size-4 rounded"
                  suppressHydrationWarning
                  type="checkbox"
                />
                <span>{t("fields.privacyConsent.label")}</span>
              </label>
              <FieldErrorMessage
                error={errors.privacyConsent}
                name="privacyConsent"
              />
            </div>

            <input type="hidden" {...register("campaignSegment")} />
            <input type="hidden" {...register("locale")} />

            {submitError ? (
              <p
                aria-live="assertive"
                className="border-destructive/25 bg-surface text-destructive rounded-md border px-3 py-2.5 text-sm font-semibold sm:col-span-2"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}

            <Button
              aria-busy={submissionPhase === "submitting"}
              className="w-full sm:col-span-2"
              disabled={isSubmitting || submissionPhase === "submitting"}
              size="lg"
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : null}
              {t("submit")}
            </Button>

            <p className="text-foreground-muted text-xs leading-5 sm:col-span-2">
              {t("privacyPrefix")}{" "}
              <PrivacyRouteLink className="focus-ring text-primary rounded-sm font-semibold underline-offset-4 hover:underline">
                {t("privacyLink")}
              </PrivacyRouteLink>
              .
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}

function PilotSuccess() {
  const t = useTranslations("landing.pilotForm.success");

  useEffect(() => {
    document.getElementById("pilot-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section
      aria-labelledby="pilot-form-heading"
      aria-live="polite"
      className="bg-surface scroll-mt-28 py-12 md:py-16"
      id="pilot-form"
      role="status"
    >
      <Container className="max-w-[54rem]">
        <div className="border-primary/20 bg-primary-subtle shadow-card rounded-lg border p-5 md:p-7">
          <p className="text-primary text-xs font-semibold tracking-[0.08em] uppercase">
            {t("eyebrow")}
          </p>
          <h2
            className="text-foreground mt-3 text-2xl leading-tight font-semibold md:text-4xl"
            id="pilot-form-heading"
          >
            {t("title")}
          </h2>
          <p className="text-foreground-muted mt-3 max-w-[62ch] text-sm leading-6 md:text-base md:leading-7">
            {t("copy")}
          </p>
          <p className="border-primary/15 bg-surface/72 text-foreground mt-4 max-w-[62ch] rounded-md border px-4 py-3 text-sm leading-6 md:text-base md:leading-7">
            {t("note")}
          </p>
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
  name,
}: {
  children: ReactNode;
  className?: string;
  error?: FieldError;
  label: string;
  name: Path<FormValues>;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <label className="text-foreground text-sm font-semibold" htmlFor={name}>
        {label}
      </label>
      {children}
      <FieldErrorMessage error={error} name={name} />
    </div>
  );
}

function FieldErrorMessage({
  error,
  name,
}: {
  error?: FieldError;
  name: string;
}) {
  if (!error?.message) {
    return null;
  }

  return (
    <p className="text-destructive text-xs font-semibold" id={`${name}-error`}>
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
    company: z.string().trim().min(2, messages.min2).max(120, messages.max120),
    role: z.string().trim().max(100, messages.max100).optional(),
    companyType: z.enum(companyTypeOptions),
    activeVendors: z.enum(activeVendorOptions),
    currentProcess: z.enum(currentProcessOptions),
    monthlyFollowUps: z.enum(monthlyFollowUpOptions).optional(),
    biggestPain: z.string().trim().max(800, messages.max800).optional(),
    privacyConsent: z.boolean().refine(Boolean, messages.consent),
    campaignSegment: z.enum(["property-management", "contractors"]),
    locale: z.enum(["en", "pl"]),
    honeypot: z.string().max(0).optional(),
  });
}

const inputClassName =
  "focus-ring h-11 w-full rounded-md border border-input bg-surface px-3 text-sm text-foreground transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-foreground-muted/65 hover:border-primary/45 disabled:cursor-not-allowed disabled:bg-surface-muted motion-reduce:transition-none";
