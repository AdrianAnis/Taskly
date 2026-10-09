"use client";

import { useEffect, type JSX } from "react";

export function PwaRegistry(): JSX.Element | null {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service Worker registration failed: ", err);
      });
    }
  }, []);

  return null;
}
