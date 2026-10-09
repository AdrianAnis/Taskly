import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServerSupabase, type ServerSupabase } from "@/lib/supabase/server";

export type Session = {
  supabase: ServerSupabase;
  user: User;
};

export async function getSession(): Promise<Session | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || data.user === null) return null;
  return { supabase, user: data.user };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (session === null) redirect("/login");
  return session;
}
