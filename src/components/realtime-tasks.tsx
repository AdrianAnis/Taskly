"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

const REFRESH_DEBOUNCE_MS = 250;

export function RealtimeTasks(): null {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const env = getSupabaseEnv();
    const supabase = createBrowserClient<Database>(env.url, env.anonKey);

    function refresh(): void {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), REFRESH_DEBOUNCE_MS);
    }

    function refreshWhenVisible(): void {
      if (document.visibilityState === "visible") refresh();
    }

    const channel = supabase
      .channel("tasks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, refresh)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") refresh();
      });

    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("online", refresh);

    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("online", refresh);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
