"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createActivitySchema,
  createTaskSchema,
  deleteByIdSchema,
  formDataToObject,
  updateTaskStatusSchema,
} from "@/lib/validation/admin";

export async function createTask(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createTaskSchema.safeParse({
    title: raw.title,
    description: raw.description,
    status: raw.status || "open",
    dueAt: raw.dueAt,
  });
  if (!parsed.success) return;

  const { data } = await supabase
    .from("tasks")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      due_at: parsed.data.dueAt,
      assigned_to: userId,
    })
    .select("id")
    .single();

  if (data?.id) {
    await supabase.from("activities").insert({
      entity_type: "task",
      entity_id: data.id,
      summary: `Task created: ${parsed.data.title}`,
      created_by: userId,
    });
  }

  revalidatePath("/admin/tasks");
}

export async function updateTaskStatus(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();
  const parsed = updateTaskStatusSchema.safeParse({
    taskId: formData.get("taskId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await supabase
    .from("tasks")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.taskId);

  await supabase.from("activities").insert({
    entity_type: "task",
    entity_id: parsed.data.taskId,
    summary: `Task status → ${parsed.data.status}`,
    created_by: userId,
  });

  revalidatePath("/admin/tasks");
}

export async function createActivity(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createActivitySchema.safeParse({
    entityType: raw.entityType || "general",
    entityId: raw.entityId,
    summary: raw.summary,
  });
  if (!parsed.success) return;

  await supabase.from("activities").insert({
    entity_type: parsed.data.entityType,
    entity_id: parsed.data.entityId,
    summary: parsed.data.summary,
    created_by: userId,
  });

  revalidatePath("/admin/tasks");
}

export async function deleteTask(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  await supabase.from("tasks").delete().eq("id", parsed.data.id);
  revalidatePath("/admin/tasks");
}
