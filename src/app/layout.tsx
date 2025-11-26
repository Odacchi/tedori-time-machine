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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "手取りタイムマシン",
    template: "%s | 手取りタイムマシン",
  },
  description: "同じ年収で、1995・2010・2025の手取りと人件費を一発比較",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "手取りタイムマシン",
    description: "同じ年収で、1995・2010・2025の手取りと人件費を一発比較",
    url: "/",
    siteName: "手取りタイムマシン",
    type: "website",
    images: [
      {
        url: "/ogp-default.png",
        width: 1200,
        height: 630,
        alt: "手取りタイムマシン",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "手取りタイムマシン",
    description: "同じ年収で、1995・2010・2025の手取りと人件費を一発比較",
    images: ["/ogp-default.png"],
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
  description:
    "同じ年収で、1995・2010・2025の手取りと人件費を一発比較",
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
          content="手取り, 年収, 社会保険料, 税金, シミュレーション, 所得税, 住民税, 日本, 1995, 2010, 2025"
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
