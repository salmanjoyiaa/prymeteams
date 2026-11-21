import { z } from "zod";

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "converted",
  "lost",
] as const;

export const PLAN_TYPES = ["solo", "team", "round_the_clock", "unset"] as const;
export const LEAD_INTENTS = ["quote", "discovery", "question"] as const;
export const TALENT_STATUSES = [
  "draft",
  "active",
  "inactive",
  "placed",
] as const;
export const JOB_STATUSES = [
  "open",
  "shortlisting",
  "interviewing",
  "filled",
  "cancelled",
] as const;
export const PLACEMENT_STATUSES = [
  "pending",
  "active",
  "ended",
  "buyout",
] as const;
export const TASK_STATUSES = [
  "open",
  "in_progress",
  "done",
  "cancelled",
] as const;
export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "void",
] as const;
export const PAYMENT_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;

const uuid = z.string().uuid("Invalid id");
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const updateLeadStageSchema = z.object({
  leadId: uuid,
  stage: z.enum(LEAD_STAGES),
});

export const addLeadNoteSchema = z.object({
  leadId: uuid,
  body: z.string().trim().min(1, "Note cannot be empty").max(8000),
});

export const addFollowUpSchema = z.object({
  leadId: uuid,
  dueAt: z
    .string()
    .min(1, "Due date is required")
    .transform((v) => new Date(v).toISOString()),
  note: optionalText(4000),
});

export const convertLeadSchema = z.object({
  leadId: uuid,
});

export const createCompanySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  website: optionalText(200),
  industry: optionalText(120),
  notes: optionalText(4000),
});

export const createTalentSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(120),
  title: optionalText(160),
  bio: optionalText(4000),
  skills: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal(""))
    .transform((s) =>
      s
        ? s
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
    ),
  yearsExperience: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number.parseInt(v, 10) : null))
    .pipe(z.number().int().min(0).max(60).nullable()),
});

export const toggleTalentSchema = z.object({
  talentId: uuid,
  field: z.enum(["approved", "public_visible"]),
  value: z
    .string()
    .transform((v) => v === "true" || v === "on")
    .pipe(z.boolean()),
});

export const createJobRequestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: optionalText(8000),
  companyId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && z.string().uuid().safeParse(v).success ? v : null)),
  status: z.enum(JOB_STATUSES).default("open"),
});

export const addShortlistSchema = z.object({
  jobRequestId: uuid,
  talentId: uuid,
  notes: optionalText(4000),
});

export const addInterviewSchema = z.object({
  jobRequestId: uuid,
  talentId: uuid,
  scheduledAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v).toISOString() : null)),
  notes: optionalText(4000),
});

export const createPlacementSchema = z.object({
  companyId: uuid,
  talentId: uuid,
  jobRequestId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && z.string().uuid().safeParse(v).success ? v : null)),
  status: z.enum(PLACEMENT_STATUSES).default("pending"),
  startDate: optionalText(32),
  notes: optionalText(4000),
});

export const updatePlacementStatusSchema = z.object({
  placementId: uuid,
  status: z.enum(PLACEMENT_STATUSES),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: optionalText(4000),
  status: z.enum(TASK_STATUSES).default("open"),
  dueAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v).toISOString() : null)),
});

export const updateTaskStatusSchema = z.object({
  taskId: uuid,
  status: z.enum(TASK_STATUSES),
});

export const createActivitySchema = z.object({
  entityType: z.string().trim().min(1).max(64),
  entityId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && z.string().uuid().safeParse(v).success ? v : null)),
  summary: z.string().trim().min(1).max(4000),
});

export const createContractSchema = z.object({
  companyId: uuid,
  title: z.string().trim().min(1).max(200),
  notes: optionalText(8000),
  placementId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && z.string().uuid().safeParse(v).success ? v : null)),
});

export const createInvoiceSchema = z.object({
  companyId: uuid,
  amountCents: z
    .string()
    .min(1, "Amount required")
    .transform((v) => Math.round(Number.parseFloat(v) * 100))
    .pipe(z.number().int().min(0)),
  currency: z.string().trim().min(3).max(3).default("USD"),
  status: z.enum(INVOICE_STATUSES).default("draft"),
  contractId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && z.string().uuid().safeParse(v).success ? v : null)),
  notes: optionalText(4000),
});

export const updateInvoiceStatusSchema = z.object({
  invoiceId: uuid,
  status: z.enum(INVOICE_STATUSES),
});

export const createPaymentSchema = z.object({
  invoiceId: uuid,
  amountCents: z
    .string()
    .min(1)
    .transform((v) => Math.round(Number.parseFloat(v) * 100))
    .pipe(z.number().int().min(0)),
  status: z.enum(PAYMENT_STATUSES).default("pending"),
  notes: optionalText(200),
});

export const updatePaymentStatusSchema = z.object({
  paymentId: uuid,
  status: z.enum(PAYMENT_STATUSES),
});

const discoveryUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine(
    (v) =>
      v.startsWith("/") ||
      v.startsWith("https://") ||
      v.startsWith("mailto:"),
    { message: "Discovery URL must be relative, https://, or mailto:" },
  )
  .refine((v) => !/^javascript:/i.test(v) && !/^data:/i.test(v), {
    message: "Invalid discovery URL scheme",
  });

const hostnameSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .refine(
    (v) =>
      v === "[YOUR DOMAIN]" ||
      /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(v) ||
      /^https?:\/\//i.test(v),
    { message: "Domain must be a hostname or http(s) URL" },
  );

export const updateSiteSettingsSchema = z.object({
  contactEmail: z.string().trim().email().max(254),
  domain: hostnameSchema,
  officeLocation: z.string().trim().min(1).max(500),
  buyOutTerms: z.string().trim().min(1).max(4000),
  discoveryUrl: discoveryUrlSchema,
});

export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

export function formDataToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}
