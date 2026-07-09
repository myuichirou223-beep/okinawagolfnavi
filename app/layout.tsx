import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../styles.css";
import "../header-refresh.css";

const siteUrl = "https://okinawagolfnavi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  title: {
    default: "おきなわGOLFなび | 沖縄県の大会・ゴルフ場・練習場・イベント情報",
    template: "%s | おきなわGOLFなび"
  },
  description:
    "おきなわGOLFなびは、沖縄県内のゴルフ大会、募集要項、成績、ゴルフ場、練習場、試打会やコンペ情報をわかりやすくまとめる地域ゴルフ情報サイトです。",
  openGraph: {
    title: "おきなわGOLFなび",
    description: "沖縄県内のゴルフ大会・ゴルフ場・練習場・イベント情報をひとつに。",
    url: siteUrl,
    siteName: "おきなわGOLFなび",
    images: ["/assets/logo.png"],
    locale: "ja_JP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image"
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/icon-152.png", sizes: "152x152", type: "image/png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "おきなわGOLFなび"
  },
  verification: {
    google: "DcVH7XpvV6qI2LAQOb4LmcUBYL638AebtZKkWa9kaK0"
  }
};

export const viewport: Viewport = {
  themeColor: "#008f5a"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Script src="/script.js" strategy="afterInteractive" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EMPPFFVKNR" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EMPPFFVKNR');
          `}
        </Script>
      </body>
    </html>
  );
}
