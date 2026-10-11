"use client";

import { useEffect, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { signOut } from "@/auth/actions";
import { Button } from "@/components/button";
import { LogOutIcon, MailIcon, PhoneIcon, XIcon } from "@/components/icons";

type ProfileModalProps = {
  email: string;
  phone?: string;
  name?: string;
};

function formatPhone(rawPhone?: string): string {
  if (!rawPhone) return "Belum diatur";
  const cleaned = rawPhone.replace(/\D/g, "");
  if (!cleaned) return rawPhone;
  if (cleaned.startsWith("62")) {
    const rest = cleaned.slice(2);
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
  }
  if (cleaned.startsWith("0")) {
    const rest = cleaned.slice(1);
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
  }
  return rawPhone;
}

export function ProfileModal({ email, phone, name }: ProfileModalProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayName = name || email.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const formattedPhone = formatPhone(phone);

  const modalContent = isOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="animate-enter relative w-full max-w-sm rounded-3xl border border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Profil Pengguna
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Tutup"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="my-4 flex flex-col items-center text-center">
          <div className="relative mb-3 flex size-16 items-center justify-center rounded-full bg-accent shadow-inner">
            <span className="text-2xl font-bold text-on-accent">{initial}</span>
          </div>
          <h2 className="text-base font-semibold text-ink">{displayName}</h2>
          <div className="mt-1 flex items-center gap-1.5 rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] text-ink-muted">
            <span className="size-1.5 rounded-full bg-success" />
            WhatsApp Terhubung
          </div>
        </div>

        <div className="my-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-muted/60 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-line text-ink-muted">
              <MailIcon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-ink-muted">Email</p>
              <p className="truncate text-xs font-medium text-ink">{email || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-muted/60 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-line text-ink-muted">
              <PhoneIcon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-ink-muted">Nomor WhatsApp</p>
              <p className="truncate text-xs font-medium text-ink">{formattedPhone}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <form action={signOut} className="w-full">
            <Button
              type="submit"
              variant="danger"
              className="w-full justify-center gap-2 h-10 min-h-10 text-xs"
            >
              <LogOutIcon className="size-3.5" />
              Keluar dari Akun
            </Button>
          </form>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="w-full justify-center h-9 min-h-9 text-xs"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-on-accent transition-all hover:opacity-90 active:scale-95"
        aria-label="Lihat Profil"
      >
        {initial}
      </button>

      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
