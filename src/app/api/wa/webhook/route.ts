import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { parseWaMessage } from "@/lib/gemini";
import { handleCommand, NOT_A_TASK_MESSAGE } from "@/lib/wa-commands";
import { createServiceSupabase } from "@/lib/supabase/server";
import { formatJakartaDateTime, parseJakartaInputValue } from "@/lib/time";
import { sendWhatsAppMessage } from "@/lib/fonnte";

export async function GET(request: Request) {
  return NextResponse.json({ status: "ok" });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const env = getServerEnv();

  const token = url.searchParams.get("token");
  if (token !== env.FONNTE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid body format" }, { status: 400 });
  }

  console.log("WA webhook body:", JSON.stringify(body));

  const message: string | undefined = body.message ?? body.text;
  const providerId: string = String(body.id ?? body.message_id ?? crypto.randomUUID());
  const sender = String(body.sender ?? "").replace(/@.*$/, "").replace(/\D/g, "");
  const owner = env.OWNER_PHONE.replace(/\D/g, "").replace(/^0|^62/, "");

  if (!sender || !message) {
    return NextResponse.json({ status: "ignored" });
  }

  if (!sender.endsWith(owner)) {
    console.warn("WA sender not whitelisted:", sender);
    return NextResponse.json({ error: "Sender not whitelisted" }, { status: 403 });
  }

  const supabase = createServiceSupabase();

  const { data: existingMessage } = await supabase
    .from("wa_messages")
    .select("id")
    .eq("provider_id", providerId)
    .single();

  if (existingMessage) {
    return NextResponse.json({ status: "already_processed" });
  }

  const command = await handleCommand(message, supabase);
  if (command?.kind === "reply") {
    await sendWhatsAppMessage(sender, command.reply);
    await supabase.from("wa_messages").insert({ provider_id: providerId, sender, body: message, parsed: { cmd: command.cmd } });
    return NextResponse.json({ status: "success", cmd: command.cmd });
  }

  const taskText = command?.kind === "add" ? command.text : message;
  const parsed = await parseWaMessage(taskText);

  if (parsed === null) {
    await sendWhatsAppMessage(sender, "⚠️ AI sedang sibuk, coba kirim ulang pesanmu sebentar lagi ya.");
    return NextResponse.json({ status: "ai_unavailable" });
  }

  if (!parsed.is_task && command === null) {
    await sendWhatsAppMessage(sender, NOT_A_TASK_MESSAGE);
    await supabase.from("wa_messages").insert({ provider_id: providerId, sender, body: message, parsed: { cmd: "not_a_task" } });
    return NextResponse.json({ status: "not_a_task" });
  }

  const title = parsed.title.trim() === "" ? taskText : parsed.title;
  let deadlineUtc: string | null = null;
  if (parsed.deadline) {
    try {
      deadlineUtc = parseJakartaInputValue(parsed.deadline).toISOString();
    } catch {
      deadlineUtc = null;
    }
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      user_id: env.OWNER_USER_ID,
      title,
      urgency: parsed.urgency,
      deadline: deadlineUtc,
      status: "todo",
      source: "wa",
    })
    .select()
    .single();

  if (taskError || !task) {
    console.error(taskError);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }

  await supabase.from("wa_messages").insert({
    provider_id: providerId,
    sender,
    body: message,
    parsed,
    task_id: task.id,
  });

  let replyMsg = `✅ *Tugas ditambahkan*\n\n📌 ${task.title}\n🚨 Urgensi: ${task.urgency}\n`;
  if (deadlineUtc) {
    replyMsg += `⏰ Deadline: ${formatJakartaDateTime(new Date(deadlineUtc))}\n`;
  }
  replyMsg += `\n_ID Tugas: #${task.short_id}_`;

  await sendWhatsAppMessage(sender, replyMsg);

  return NextResponse.json({ status: "success", task: task.short_id });
}
