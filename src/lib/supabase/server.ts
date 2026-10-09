import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export type ServerSupabase = SupabaseClient<Database>;

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2];
};

export async function createServerSupabase(): Promise<ServerSupabase> {
  const cookieStore = await cookies();
  const env = getSupabaseEnv();
  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        writeCookiesWhenAllowed(cookieStore, cookiesToSet);
      },
    },
  });
}

function writeCookiesWhenAllowed(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  cookiesToSet: CookieToSet[],
): void {
  try {
    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
  } catch {
    return;
  }
}
