import type { JSX, ReactNode } from "react";
import { signOut } from "@/auth/actions";
import { requireSession } from "@/auth/session";
import { Button } from "@/components/button";

export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  await requireSession();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="font-semibold text-ink">Todolist</h1>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="md" className="h-9 min-h-9 px-3 text-sm">
              Keluar
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
