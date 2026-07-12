import type { z } from "zod";

import type { leadSchema } from "@/lib/lead-schema";

export type LeadInput = z.infer<typeof leadSchema>;
