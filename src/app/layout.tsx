import type { Metadata, Viewport } from "next";
import { PwaRegistry } from "@/components/pwa-registry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskly",
  description: "Aplikasi Todo List dengan notifikasi WhatsApp",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Taskly",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PwaRegistry />
        {children}
      </body>
    </html>
  );
}
