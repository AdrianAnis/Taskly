import { z } from "zod";

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

export function getSupabaseEnv(): SupabaseEnv {
  const env = supabaseEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

const serverEnvSchema = z.object({
  FONNTE_TOKEN: z.string().min(1),
  FONNTE_WEBHOOK_SECRET: z.string().min(1),
  CRON_SECRET: z.string().min(1),
  OWNER_USER_ID: z.string().min(1),
  OWNER_PHONE: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    FONNTE_TOKEN: process.env.FONNTE_TOKEN,
    FONNTE_WEBHOOK_SECRET: process.env.FONNTE_WEBHOOK_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
    OWNER_USER_ID: process.env.OWNER_USER_ID,
    OWNER_PHONE: process.env.OWNER_PHONE,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
