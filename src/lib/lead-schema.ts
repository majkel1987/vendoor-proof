import { z } from "zod";

export const leadSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  workEmail: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().max(100).optional(),
  companyType: z.enum([
    "Property management",
    "General contractor",
    "Facilities",
    "Other"
  ]),
  activeVendors: z.enum(["1-25", "26-100", "101-250", "250+"]),
  currentProcess: z.enum([
    "Spreadsheet",
    "Shared drive",
    "Existing software",
    "Other"
  ]),
  monthlyFollowUps: z
    .enum(["1-10", "11-25", "26-50", "50+", "Not sure"])
    .optional(),
  biggestPain: z.string().trim().max(800).optional(),
  privacyConsent: z.literal(true),
  campaignSegment: z.enum(["property-management", "contractors"]),
  locale: z.enum(["en", "pl"]),
  honeypot: z.string().max(0).optional()
});
