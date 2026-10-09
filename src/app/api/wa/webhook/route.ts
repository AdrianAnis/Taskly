import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { parseWaMessage } from "@/lib/gemini";
import { createServiceSupabase } from "@/lib/supabase/server";
import { parseJakartaInputValue, toJakartaInputValue } from "@/lib/time";
import { sendWhatsAppMessage } from "@/lib/fonnte";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const env = getServerEnv();

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

  const sender = body.sender;
  const message = body.message;
  const providerId = body.id;

  if (!sender || !message || !providerId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!sender.endsWith(env.OWNER_PHONE.replace(/^0|^62/, ""))) {
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

  const msgLower = message.trim().toLowerCase();
  
  if (msgLower === "list") {
    const { data: activeTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "todo")
      .order("created_at", { ascending: true });

    let replyMsg = "📋 *Daftar Tugas Aktif*\n\n";
    if (!activeTasks || activeTasks.length === 0) {
      replyMsg += "Tidak ada tugas! 🎉";
    } else {
      activeTasks.forEach((t) => {
        replyMsg += `[#${t.short_id}] ${t.title} - ${t.urgency.toUpperCase()}\n`;
        if (t.deadline) {
          replyMsg += `⏰ ${toJakartaInputValue(new Date(t.deadline))}\n`;
        }
        replyMsg += "\n";
      });
    }

    await sendWhatsAppMessage(sender, replyMsg);
    await supabase.from("wa_messages").insert({ provider_id: providerId, sender, body: message, parsed: { cmd: "list" } });
    return NextResponse.json({ status: "success", cmd: "list" });
  }

  if (msgLower.startsWith("selesai ")) {
    const shortIdStr = msgLower.replace("selesai ", "").trim();
    const shortId = parseInt(shortIdStr, 10);
    
    if (!isNaN(shortId)) {
      const { data: updated, error: updateErr } = await supabase
        .from("tasks")
        .update({ status: "done", completed_at: new Date().toISOString() })
        .eq("short_id", shortId)
        .eq("status", "todo")
        .select()
        .single();
        
      let replyMsg = "";
      if (updateErr || !updated) {
        replyMsg = `⚠️ Gagal menandai selesai. Tugas #${shortId} tidak ditemukan atau sudah selesai.`;
      } else {
        replyMsg = `✅ Tugas selesai: *${updated.title}*`;
      }
      
      await sendWhatsAppMessage(sender, replyMsg);
      await supabase.from("wa_messages").insert({ provider_id: providerId, sender, body: message, parsed: { cmd: "selesai", shortId } });
      return NextResponse.json({ status: "success", cmd: "selesai" });
    }
  }

  const parsed = await parseWaMessage(message);
  
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
      title: parsed.title,
      urgency: parsed.urgency,
      deadline: deadlineUtc,
      status: "todo",
      source: "wa"
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
    parsed: parsed,
    task_id: task.id,
  });

  let replyMsg = `✅ *Tugas ditambahkan*\n\n📌 ${task.title}\n🚨 Urgensi: ${task.urgency}\n`;
  if (deadlineUtc) {
    replyMsg += `⏰ Deadline: ${toJakartaInputValue(new Date(deadlineUtc))}\n`;
  }
  replyMsg += `\n_ID Tugas: #${task.short_id}_`;

  await sendWhatsAppMessage(sender, replyMsg);

  return NextResponse.json({ status: "success", task: task.short_id });
}
