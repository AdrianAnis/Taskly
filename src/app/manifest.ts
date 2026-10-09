import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taskly",
    short_name: "Taskly",
    description: "Aplikasi Todo List dengan notifikasi WhatsApp",
    start_url: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#171717",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
