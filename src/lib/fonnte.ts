import { getServerEnv } from "./env";

type SendMessageResult = { ok: true } | { ok: false; error: string };

export async function sendWhatsAppMessage(target: string, message: string): Promise<SendMessageResult> {
  const env = getServerEnv();
  
  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: env.FONNTE_TOKEN,
      },
      body: new URLSearchParams({
        target,
        message,
      }),
    });

    const data = await response.json();
    if (data.status) {
      return { ok: true };
    }
    
    console.error("Fonnte send failed", JSON.stringify(data));
    return { ok: false, error: data.reason || "Fonnte API returned false status" };
  } catch (error) {
    console.error("Failed to send WA message", error);
    return { ok: false, error: "Network error when calling Fonnte" };
  }
}
