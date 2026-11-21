"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createContractSchema,
  createInvoiceSchema,
  createPaymentSchema,
  formDataToObject,
  updateInvoiceStatusSchema,
  updatePaymentStatusSchema,
} from "@/lib/validation/admin";

export async function createContract(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createContractSchema.safeParse({
    companyId: raw.companyId,
    title: raw.title,
    notes: raw.notes,
    placementId: raw.placementId,
  });
  if (!parsed.success) return;

  await supabase.from("contracts").insert({
    company_id: parsed.data.companyId,
    title: parsed.data.title,
    notes: parsed.data.notes || null,
    placement_id: parsed.data.placementId,
    status: "draft",
  });

  revalidatePath("/admin/finance");
}

export async function createInvoice(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createInvoiceSchema.safeParse({
    companyId: raw.companyId,
    amountCents: raw.amount,
    currency: raw.currency || "USD",
    status: raw.status || "draft",
    contractId: raw.contractId,
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("invoices").insert({
    company_id: parsed.data.companyId,
    amount_cents: parsed.data.amountCents,
    currency: parsed.data.currency,
    status: parsed.data.status,
    contract_id: parsed.data.contractId,
    notes: parsed.data.notes || null,
  });

  revalidatePath("/admin/finance");
}

export async function updateInvoiceStatus(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = updateInvoiceStatusSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await supabase
    .from("invoices")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.invoiceId);

  revalidatePath("/admin/finance");
}

export async function createPayment(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createPaymentSchema.safeParse({
    invoiceId: raw.invoiceId,
    amountCents: raw.amount,
    status: raw.status || "pending",
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("payments").insert({
    invoice_id: parsed.data.invoiceId,
    amount_cents: parsed.data.amountCents,
    status: parsed.data.status,
    notes: parsed.data.notes || null,
  });

  revalidatePath("/admin/finance");
}

export async function updatePaymentStatus(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = updatePaymentStatusSchema.safeParse({
    paymentId: formData.get("paymentId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await supabase
    .from("payments")
    .update({
      status: parsed.data.status,
      paid_at:
        parsed.data.status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.paymentId);

  revalidatePath("/admin/finance");
}
