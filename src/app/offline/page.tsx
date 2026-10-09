import type { JSX } from "react";
import Link from "next/link";

export default function OfflinePage(): JSX.Element {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-2xl text-ink-muted">
          📡
        </div>
        <h1 className="text-xl font-bold text-ink">Anda sedang Offline</h1>
        <p className="text-sm text-ink-muted">
          Sepertinya Anda tidak terhubung ke internet. Aplikasi akan memuat ulang secara otomatis ketika koneksi kembali.
        </p>
        <Link 
          href="/" 
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          Coba Lagi
        </Link>
      </div>
    </main>
  );
}
