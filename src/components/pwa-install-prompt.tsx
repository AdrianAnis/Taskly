"use client";

import { useEffect, useState, type JSX } from "react";
import { Button } from "@/components/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt(): JSX.Element | null {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!deferredPrompt || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-hover p-4 shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-ink">Install Taskly</h3>
        <p className="text-xs text-ink-muted">Akses lebih cepat & bisa offline</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="md" onClick={() => setIsDismissed(true)}>
          Nanti
        </Button>
        <Button size="md" onClick={handleInstallClick}>
          Install
        </Button>
      </div>
    </div>
  );
}
