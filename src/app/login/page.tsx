import type { JSX } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/auth/login-form";
import { getSession } from "@/auth/session";
import { Logo } from "@/components/logo";

export const instant = false;

export default async function LoginPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (session !== null) redirect("/");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-sm">
        <header className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-5 size-16" />
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Masuk ke Taskly</h1>
          <p className="mt-2 text-sm text-ink-muted">Silakan masuk untuk mengelola tugas Anda.</p>
        </header>
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
