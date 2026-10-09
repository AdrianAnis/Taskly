"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { fail, type ActionResult } from "@/lib/action-result";
import { createServerSupabase } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.email({ error: "Masukkan alamat email yang valid." }),
  password: z.string().min(1, { error: "Kata sandi wajib diisi." }),
});

export async function signIn(formData: FormData): Promise<ActionResult<null>> {
  const credentials = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!credentials.success) {
    return fail(credentials.error.issues[0]?.message ?? "Data masuk tidak valid.");
  }
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(credentials.data);
  if (error) return fail("Email atau kata sandi salah. Periksa lalu coba lagi.");
  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}
