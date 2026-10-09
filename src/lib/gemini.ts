import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { getServerEnv } from "./env";
import { formatJakartaDateTime, now } from "./time";

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

  const prompt = `Kamu adalah asisten ekstraksi data todo list.
Waktu sekarang (Asia/Jakarta): ${currentTimeStr}

Pesan WA: "${message}"

Ekstrak menjadi JSON dengan skema:
{
  "title": "Nama tugas (tanpa kata urgensi/deadline)",
  "urgency": "ringan" | "sedang" | "banget",
  "deadline": "YYYY-MM-DDTHH:mm" (format 24 jam) atau null jika tidak ada tenggat waktu
}

Aturan:
- Urgensi: jika ada kata 'urgent', 'penting', 'asap', 'banget' -> 'banget'. Jika santai -> 'ringan'. Default 'sedang'.
- Jam tanpa tanggal: hari ini jika belum terlewat, jika sudah terlewat maka besok.
- Tanggal tanpa jam: 23:59.
- JANGAN sertakan markdown backticks, HANYA JSON murni.`;

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
