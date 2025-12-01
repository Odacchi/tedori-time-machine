import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseDescription =
  "同じ年収でも、過去・現在・未来で手取りがどれだけ変わるかを比較できる「手取りタイムマシン」。額面年収を入れるだけで、1995・2010・2025・将来シナリオ2040年の手取りや税金・社会保険料、会社負担分を一目で比較できます。";

const ogpImage = "/ogp-20251201.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "手取りタイムマシン",
    template: "%s | 手取りタイムマシン",
  },
  description: baseDescription,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "手取りタイムマシン",
    description: baseDescription,
    url: "/",
    siteName: "手取りタイムマシン",
    type: "website",
    images: [
      {
        url: ogpImage,
        width: 1200,
        height: 630,
        alt: "手取りタイムマシン - 同じ年収でも、過去・現在・未来で手取りはどれだけ変わる？",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "手取りタイムマシン",
    description: baseDescription,
    images: [ogpImage],
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "手取りタイムマシン",
  url: siteUrl,
  inLanguage: "ja-JP",
  applicationCategory: "FinanceApplication",
  description: baseDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta
          name="keywords"
          content="手取りタイムマシン, 手取り, 年収, 社会保険料, 税金, シミュレーション, 所得税, 住民税, 日本, 1995年, 2010年, 2025年, 2040年, 将来シナリオ"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}