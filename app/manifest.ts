import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "おきなわGOLFなび",
    short_name: "GOLFなび",
    description:
      "沖縄県内のゴルフ大会、ゴルフ場、練習場、イベント情報をまとめて確認できるゴルフ情報ポータル。",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#008f5a",
    orientation: "portrait-primary",
    lang: "ja",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
