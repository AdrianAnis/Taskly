import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { getServerEnv } from "./env";
import { formatJakartaDateTime, now, toJakartaDateKey } from "./time";

const TaskParsedSchema = z.object({
  title: z.string(),
  urgency: z.enum(["ringan", "sedang", "banget"]),
  deadline: z.string().nullable(),
});

const MODELS = ["gemini-3.5-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite"];

export type ParsedTask = z.infer<typeof TaskParsedSchema>;

export async function parseWaMessage(message: string): Promise<ParsedTask> {
  const env = getServerEnv();
  
  if (!env.GEMINI_API_KEY) {
    return { title: message, urgency: "sedang", deadline: null };
  }

  const ai = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const currentTimeStr = formatJakartaDateTime(now());

  const calendar = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now().getTime() + i * 24 * 60 * 60 * 1000);
    const label = i === 0 ? "hari ini" : i === 1 ? "besok" : i === 2 ? "lusa" : `+${i} hari`;
    return `${toJakartaDateKey(day)} = ${formatJakartaDateTime(day).split(" ").slice(0, 4).join(" ")} (${label})`;
  }).join("\n");

  const prompt = `Kamu adalah asisten to-do list pribadi berbahasa Indonesia santai/gaul. Tugasmu mengubah chat WhatsApp menjadi data tugas yang rapi.

Waktu sekarang (Asia/Jakarta): ${currentTimeStr}
Kalender 14 hari ke depan:
${calendar}

Pesan WA: "${message}"

Keluarkan JSON dengan skema:
{
  "title": string,
  "urgency": "ringan" | "sedang" | "banget",
  "deadline": "YYYY-MM-DDTHH:mm" | null
}

ATURAN TITLE:
- Singkat (maksimal ~8 kata), diawali huruf kapital, berupa aktivitas/objek tugas yang jelas.
- Buang kata pembuka dan basa-basi: "tolong", "tambahkan tugas", "ingetin", "catat", "buatin", "ya", "dong", serta kata waktu dan urgensi ("besok", "jam 13:00", "penting banget", "deadline", "DL nya").
- Pertahankan nama mata kuliah/proyek/orang/singkatan (misal "KWG", "PBO") apa adanya, jangan diubah atau diperluas.
- Ubah bahasa gaul menjadi bentuk natural tapi jangan ubah maknanya ("ngerjain" -> "Kerjakan", "nugas" -> "Tugas", "beli" tetap "Beli").

ATURAN URGENCY:
- "banget": ada kata penting/urgent/asap/genting/wajib/jangan lupa, atau deadline dalam <= 24 jam dan terkesan mendesak.
- "ringan": santai, kalau sempat, nggak buru-buru, kapan-kapan.
- "sedang": selain itu (default).

ATURAN DEADLINE (gunakan kalender di atas, jangan menghitung sendiri):
- "hari Minggu/Senin/..." atau "minggu ini" + nama hari = tanggal terdekat hari itu yang belum lewat dari kalender.
- "minggu depan" tanpa hari = Senin minggu depan; "akhir pekan" = Sabtu terdekat.
- "siang" = 12:00 bila tanpa jam, "pagi" = 08:00, "sore" = 16:00, "malam" = 20:00. "jam 3 sore" = 15:00.
- Jam tanpa tanggal: hari ini jika belum lewat, kalau sudah lewat maka besok.
- Tanggal/hari tanpa jam sama sekali: 23:59.
- Tidak ada petunjuk waktu sama sekali: null. Jangan mengarang deadline.

CONTOH (anggap sekarang Jumat 09 Okt 2026 17:30):
"tolong tambahin tugas ngerjain laporan presentasi besok siang jam 13:00, penting banget" ->
{"title":"Kerjakan laporan presentasi","urgency":"banget","deadline":"2026-10-10T13:00"}
"ingetin beli galon nanti malam" ->
{"title":"Beli galon","urgency":"sedang","deadline":"2026-10-09T20:00"}
"kalau sempat rapihin folder kuliah" ->
{"title":"Rapikan folder kuliah","urgency":"ringan","deadline":null}

Balas HANYA JSON murni tanpa markdown.`;

  for (const modelName of MODELS) {
    try {
      const model = ai.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: "application/json" } });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (!text) throw new Error("No response text");

      return TaskParsedSchema.parse(JSON.parse(text));
    } catch (error) {
      console.error(`Gemini ${modelName} failed`, error);
    }
  }

  return { title: message, urgency: "sedang", deadline: null };
}
