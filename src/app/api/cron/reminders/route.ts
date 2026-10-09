import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { sendWhatsAppMessage } from "@/lib/fonnte";
import { createServiceSupabase } from "@/lib/supabase/server";
import { now } from "@/lib/time";
import { selectDueReminders } from "@/tasks/select-due";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const env = getServerEnv();

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabase();
  
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "todo")
    .not("deadline", "is", null);

  if (error || !tasks) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  const currentTime = now();
  const dueReminders = selectDueReminders(tasks, currentTime);
  const results = [];

  for (const { task, type } of dueReminders) {
    const isD0 = type === "H-0";
    const prefix = isD0 ? "🚨 *HARI INI DEADLINE*" : "⚠️ *PENGINGAT H-1*";
    const message = `${prefix}\n\nTugas: *${task.title}*`;

    const sendResult = await sendWhatsAppMessage(env.OWNER_PHONE, message);

    if (sendResult.ok) {
      const updateData = isD0 
        ? { remind_d0_at: currentTime.toISOString() } 
        : { remind_d1_at: currentTime.toISOString() };
        
      const { error: updateError } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", task.id);
        
      if (updateError) {
        console.error(updateError);
        results.push({ id: task.id, status: "sent_but_db_failed" });
      } else {
        results.push({ id: task.id, status: "success", type });
      }
    } else {
      console.error(sendResult.error);
      results.push({ id: task.id, status: "failed", reason: sendResult.error });
    }
  }

  return NextResponse.json({ processed: dueReminders.length, results });
}
