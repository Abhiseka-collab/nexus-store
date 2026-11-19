import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexus-store-5s8orsfkz-abhi-4d1e.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEXUS | Premium 16-in-1 Personal Growth System & Digital Tools",
    template: "%s | NEXUS",
  },
  description:
    "Supercharge your productivity with the 16-in-1 Personal Growth System (.xlsx). Habit trackers, 20-goal framework, deep work logs, and AI prompts with instant delivery.",
  keywords: [
    "personal growth system",
    "excel habit tracker",
    "google sheets life os",
    "productivity spreadsheet",
    "digital planner excel",
    "habit streak tracker",
    "goal tracking template",
    "nexus store",
    "digital assets"
  ],
  authors: [{ name: "NEXUS Store" }],
  creator: "NEXUS",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "NEXUS | 16-in-1 Personal Growth System (.xlsx)",
    description:
      "Complete life operating system for high performers. 100% offline, automated streak engine, and instant Excel download.",
    siteName: "NEXUS Digital Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS | 16-in-1 Personal Growth System (.xlsx)",
    description:
      "Track habits, goals, projects, and deep work in one unified Excel & Google Sheets operating system.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}