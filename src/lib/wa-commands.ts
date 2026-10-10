import type { ServerSupabase } from "@/lib/supabase/server";
import { formatJakartaDateTime, now, parseJakartaInputValue, toJakartaDateKey } from "@/lib/time";

type TaskRow = {
  short_id: number;
  title: string;
  urgency: string;
  deadline: string | null;
};

export type CommandResult =
  | { kind: "reply"; reply: string; cmd: string }
  | { kind: "add"; text: string };

const DAY_MS = 24 * 60 * 60 * 1000;

export const HELP_MESSAGE = [
  "🤖 *Taskly*",
  "",
  "Ketik tugasmu langsung, contoh:",
  "_laprak basdat besok jam 9, penting_",
  "",
  "Atau pakai perintah:",
  "/daftar — semua tugas aktif",
  "/dl hari ini — deadline hari ini",
  "/dl besok — deadline besok",
  "/dl minggu ini — 7 hari ke depan",
  "/terlewat — tugas yang lewat deadline",
  "/selesai 3 — tandai tugas #3 selesai",
  "/hapus 3 — hapus tugas #3",
  "/tambah teks — paksa catat sebagai tugas",
  "/bantuan — tampilkan pesan ini",
].join("\n");

export const NOT_A_TASK_MESSAGE = `Hmm, itu sepertinya bukan tugas 🤔\n\n${HELP_MESSAGE}`;

function dayStartIso(offsetDays: number): string {
  const key = toJakartaDateKey(new Date(now().getTime() + offsetDays * DAY_MS));
  return parseJakartaInputValue(`${key}T00:00`).toISOString();
}

function formatTaskList(title: string, tasks: readonly TaskRow[] | null, emptyText: string): string {
  if (tasks === null || tasks.length === 0) return `${title}\n\n${emptyText}`;
  const lines = tasks.map((task) => {
    const deadline = task.deadline === null ? "" : `\n⏰ ${formatJakartaDateTime(new Date(task.deadline))}`;
    return `[#${task.short_id}] ${task.title} - ${task.urgency.toUpperCase()}${deadline}`;
  });
  return `${title}\n\n${lines.join("\n\n")}`;
}

async function listActive(supabase: ServerSupabase): Promise<string> {
  const { data } = await supabase
    .from("tasks")
    .select("short_id, title, urgency, deadline")
    .eq("status", "todo")
    .order("deadline", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  return formatTaskList("📋 *Daftar Tugas Aktif*", data, "Tidak ada tugas! 🎉");
}

async function listDeadlines(supabase: ServerSupabase, range: string): Promise<string> {
  const normalized = range.trim().toLowerCase();
  const isWeek = normalized.startsWith("minggu");
  const isTomorrow = normalized === "besok";
  const startOffset = isTomorrow ? 1 : 0;
  const endOffset = isWeek ? 7 : startOffset + 1;
  const label = isWeek ? "7 Hari ke Depan" : isTomorrow ? "Besok" : "Hari Ini";

  const { data } = await supabase
    .from("tasks")
    .select("short_id, title, urgency, deadline")
    .eq("status", "todo")
    .gte("deadline", dayStartIso(startOffset))
    .lt("deadline", dayStartIso(endOffset))
    .order("deadline", { ascending: true });
  return formatTaskList(`⏰ *Deadline ${label}*`, data, "Tidak ada deadline 🎉");
}

async function listOverdue(supabase: ServerSupabase): Promise<string> {
  const { data } = await supabase
    .from("tasks")
    .select("short_id, title, urgency, deadline")
    .eq("status", "todo")
    .lt("deadline", now().toISOString())
    .order("deadline", { ascending: true });
  return formatTaskList("🚨 *Tugas Terlewat*", data, "Tidak ada yang terlewat 👍");
}

async function completeTask(supabase: ServerSupabase, shortId: number): Promise<string> {
  const { data } = await supabase
    .from("tasks")
    .update({ status: "done", completed_at: now().toISOString() })
    .eq("short_id", shortId)
    .eq("status", "todo")
    .select("title")
    .maybeSingle();
  return data === null
    ? `⚠️ Tugas #${shortId} tidak ditemukan atau sudah selesai.`
    : `✅ Tugas selesai: *${data.title}*`;
}

async function deleteTask(supabase: ServerSupabase, shortId: number): Promise<string> {
  const { data } = await supabase.from("tasks").delete().eq("short_id", shortId).select("title").maybeSingle();
  return data === null ? `⚠️ Tugas #${shortId} tidak ditemukan.` : `🗑️ Tugas dihapus: *${data.title}*`;
}

function parseShortId(argument: string): number | null {
  const match = argument.trim().match(/^#?(\d+)$/);
  return match === null ? null : Number.parseInt(match[1], 10);
}

export async function handleCommand(text: string, supabase: ServerSupabase): Promise<CommandResult | null> {
  const trimmed = text.trim();
  const slash = trimmed.match(/^\/(\S+)\s*([\s\S]*)$/);
  const legacy = trimmed.match(/^(list|selesai)\b\s*([\s\S]*)$/i);
  const match = slash ?? legacy;
  if (match === null) return null;

  const command = match[1].toLowerCase();
  const argument = match[2];
  const reply = (body: string): CommandResult => ({ kind: "reply", reply: body, cmd: command });

  switch (command) {
    case "bantuan":
    case "help":
    case "menu":
    case "start":
      return reply(HELP_MESSAGE);
    case "daftar":
    case "list":
      return reply(await listActive(supabase));
    case "dl":
    case "deadline":
      return reply(await listDeadlines(supabase, argument));
    case "terlewat":
      return reply(await listOverdue(supabase));
    case "selesai": {
      const shortId = parseShortId(argument);
      return reply(shortId === null ? "Format: /selesai 3" : await completeTask(supabase, shortId));
    }
    case "hapus": {
      const shortId = parseShortId(argument);
      return reply(shortId === null ? "Format: /hapus 3" : await deleteTask(supabase, shortId));
    }
    case "tambah":
      return argument.trim() === "" ? reply("Format: /tambah beli galon besok jam 9") : { kind: "add", text: argument.trim() };
    default:
      return slash === null ? null : reply(`Perintah /${command} tidak dikenal.\n\n${HELP_MESSAGE}`);
  }
}
