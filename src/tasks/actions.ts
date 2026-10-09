"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { getSession } from "@/auth/session";
import { fail, succeed, type ActionResult } from "@/lib/action-result";
import { now } from "@/lib/time";
import { taskIdSchema, taskInputSchema, taskStatusSchema } from "@/tasks/schema";

const SESSION_EXPIRED = "Sesi berakhir. Silakan masuk lagi.";
const SAVE_FAILED = "Tugas gagal disimpan. Coba lagi sebentar.";
const NOT_FOUND = "Tugas tidak ditemukan. Muat ulang halaman.";

function readField(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

function firstIssueMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "Data tugas tidak valid.";
}

function parseTaskForm(formData: FormData) {
  return taskInputSchema.safeParse({
    title: readField(formData, "title"),
    urgency: readField(formData, "urgency"),
    deadline: readField(formData, "deadline"),
  });
}

export async function createTask(formData: FormData): Promise<ActionResult<null>> {
  const input = parseTaskForm(formData);
  if (!input.success) return fail(firstIssueMessage(input.error));
  const session = await getSession();
  if (session === null) return fail(SESSION_EXPIRED);
  const { error } = await session.supabase
    .from("tasks")
    .insert({ ...input.data, user_id: session.user.id, source: "web" });
  if (error) return fail(SAVE_FAILED);
  revalidatePath("/");
  return succeed(null);
}

export async function updateTask(id: string, formData: FormData): Promise<ActionResult<null>> {
  const taskId = taskIdSchema.safeParse(id);
  if (!taskId.success) return fail(firstIssueMessage(taskId.error));
  const input = parseTaskForm(formData);
  if (!input.success) return fail(firstIssueMessage(input.error));
  const session = await getSession();
  if (session === null) return fail(SESSION_EXPIRED);
  const { data, error } = await session.supabase
    .from("tasks")
    .update(input.data)
    .eq("id", taskId.data)
    .select("id");
  if (error) return fail(SAVE_FAILED);
  if (data.length === 0) return fail(NOT_FOUND);
  revalidatePath("/");
  return succeed(null);
}

export async function setTaskStatus(id: string, status: string): Promise<ActionResult<null>> {
  const taskId = taskIdSchema.safeParse(id);
  const nextStatus = taskStatusSchema.safeParse(status);
  if (!taskId.success || !nextStatus.success) return fail("Perubahan status tidak valid.");
  const session = await getSession();
  if (session === null) return fail(SESSION_EXPIRED);
  const completedAt = nextStatus.data === "done" ? now().toISOString() : null;
  const { data, error } = await session.supabase
    .from("tasks")
    .update({ status: nextStatus.data, completed_at: completedAt })
    .eq("id", taskId.data)
    .select("id");
  if (error) return fail(SAVE_FAILED);
  if (data.length === 0) return fail(NOT_FOUND);
  revalidatePath("/");
  return succeed(null);
}

export async function deleteTask(id: string): Promise<ActionResult<null>> {
  const taskId = taskIdSchema.safeParse(id);
  if (!taskId.success) return fail(firstIssueMessage(taskId.error));
  const session = await getSession();
  if (session === null) return fail(SESSION_EXPIRED);
  const { data, error } = await session.supabase
    .from("tasks")
    .delete()
    .eq("id", taskId.data)
    .select("id");
  if (error) return fail("Tugas gagal dihapus. Coba lagi sebentar.");
  if (data.length === 0) return fail(NOT_FOUND);
  revalidatePath("/");
  return succeed(null);
}
