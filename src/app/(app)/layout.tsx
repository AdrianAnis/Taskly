import type { JSX, ReactNode } from "react";
import { requireSession } from "@/auth/session";
import { Logo } from "@/components/logo";
import { ProfileModal } from "@/components/profile-modal";
import { RealtimeTasks } from "@/components/realtime-tasks";

export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const { user } = await requireSession();
  const phone = (user.user_metadata?.phone as string | undefined) || process.env.OWNER_PHONE || "";
  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="flex min-h-dvh flex-col">
      <RealtimeTasks />
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/80 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="size-8" />
            <h1 className="text-[15px] font-semibold tracking-tight text-ink">Taskly</h1>
          </div>
          <ProfileModal email={user.email ?? ""} phone={phone} name={name} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}

