import { createHash } from "node:crypto";

import nodemailer from "nodemailer";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  buildLeadEmailHtml,
  buildLeadEmailText
} from "@/lib/lead-email-template";
import { leadSchema } from "@/lib/lead-schema";
import { checkRateLimit } from "@/lib/rate-limit";

const leadRequestSchema = leadSchema.extend({
  source: z.string().trim().max(200).optional(),
  referrer: z.string().trim().max(500).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
  utmContent: z.string().trim().max(100).optional(),
  utmTerm: z.string().trim().max(100).optional()
});

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (isHoneypotSubmission(payload)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ipAddress = getClientIp(request);
  const emailHash = hashValue(parsed.data.workEmail.toLowerCase());
  const rateLimit = await checkRateLimit({
    key: `lead:${ipAddress}:${emailHash}`,
    limit: 3,
    windowMs: 60 * 60 * 1000
  });

  if (!rateLimit.success) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const lead = { ...parsed.data };
  delete lead.honeypot;
  const handoffPayload = {
    ...lead,
    emailHash,
    freeEmailDomain: isLikelyFreeEmailDomain(lead.workEmail),
    receivedAt: new Date().toISOString(),
    ipHash: hashValue(ipAddress),
    userAgent: request.headers.get("user-agent") ?? undefined
  };

  try {
    await handoffLead(handoffPayload);
  } catch (error) {
    console.error("Lead handoff failed", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function isHoneypotSubmission(payload: unknown) {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "honeypot" in payload &&
    typeof payload.honeypot === "string" &&
    payload.honeypot.trim().length > 0
  );
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function isLikelyFreeEmailDomain(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();

  if (!domain) {
    return false;
  }

  return new Set([
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "yahoo.com",
    "proton.me",
    "protonmail.com"
  ]).has(domain);
}

async function handoffLead(payload: Record<string, unknown>) {
  const crmWebhookUrl = process.env.LEAD_CRM_WEBHOOK_URL;
  const emailWebhookUrl = process.env.LEAD_EMAIL_WEBHOOK_URL;

  await Promise.all(
    [
      ...[crmWebhookUrl, emailWebhookUrl].filter(Boolean).map((url) =>
        fetch(url as string, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(payload)
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Lead handoff returned ${response.status}`);
          }
        })
      ),
      sendLeadEmail(payload)
    ]
  );
}

async function sendLeadEmail(payload: Record<string, unknown>) {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.CONTACT_EMAIL_TO;

  if (!user || !password || !recipient) {
    throw new Error("Gmail SMTP configuration is missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass: password
    }
  });

  const emailPayload = {
    firstName: stringValue(payload.firstName),
    workEmail: stringValue(payload.workEmail, "Unknown") ?? "Unknown",
    company: stringValue(payload.company, "Unknown") ?? "Unknown",
    role: stringValue(payload.role),
    companyType: stringValue(payload.companyType, "Unknown") ?? "Unknown",
    activeVendors: stringValue(payload.activeVendors, "Unknown") ?? "Unknown",
    currentProcess: stringValue(payload.currentProcess, "Unknown") ?? "Unknown",
    monthlyFollowUps: stringValue(payload.monthlyFollowUps),
    biggestPain: stringValue(payload.biggestPain),
    campaignSegment: stringValue(payload.campaignSegment, "Unknown") ?? "Unknown",
    locale: stringValue(payload.locale, "Unknown") ?? "Unknown",
    source: stringValue(payload.source),
    referrer: stringValue(payload.referrer),
    receivedAt: stringValue(payload.receivedAt, new Date().toISOString()) ?? new Date().toISOString()
  };

  await transporter.sendMail({
    from: `COI Tracker <${user}>`,
    to: recipient,
    replyTo: emailPayload.workEmail,
    subject: `New COI Tracker lead: ${emailPayload.company}`,
    text: buildLeadEmailText(emailPayload),
    html: buildLeadEmailHtml(emailPayload)
  });
}

function stringValue(value: unknown, fallback?: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
