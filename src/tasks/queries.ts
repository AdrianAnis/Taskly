import { requireSession } from "@/auth/session";
import type { Task, TaskStatus } from "@/tasks/schema";

const TASK_COLUMNS = "id, short_id, user_id, title, urgency, deadline, status, source, created_at, completed_at, remind_d1_at, remind_d0_at";

export async function listTasks(status: TaskStatus): Promise<Task[]> {
  const { supabase } = await requireSession();
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .eq("status", status)
    .order(status === "done" ? "completed_at" : "created_at", { ascending: status !== "done" });
  if (error) throw new Error("Gagal memuat daftar tugas.");
  return data;
}

export async function countTasks(status: TaskStatus): Promise<number> {
  const { supabase } = await requireSession();
  const { count, error } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("status", status);
  if (error) throw new Error("Gagal menghitung tugas.");
  return count ?? 0;
}
