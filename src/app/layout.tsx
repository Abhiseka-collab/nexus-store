import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://nexus-store-woad.vercel.app";
};

const siteUrl = getBaseUrl();

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${siteUrl}/#product`,
      "name": "16-in-1 Personal Growth System (.xlsx)",
      "description":
        "Production-grade Life OS spreadsheet built for Microsoft Excel and Google Sheets. 16 interconnected tabs, automated habit streak tracker, 20-goal matrix, and AI reflection prompts.",
      "image": `${siteUrl}/personal-growth-system-cover.svg`,
      "brand": {
        "@type": "Brand",
        "name": "NEXUS",
      },
      "category": "Software > Business & Productivity Software",
      "offers": [
        {
          "@type": "Offer",
          "price": "10",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": siteUrl,
          "priceValidUntil": "2027-12-31",
        },
        {
          "@type": "Offer",
          "price": "1",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": siteUrl,
          "priceValidUntil": "2027-12-31",
        },
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.96",
        "bestRating": "5",
        "ratingCount": "128",
        "reviewCount": "128",
      },
    },
    {
      "@type": "SoftwareApplication",
      "name": "Personal Growth System",
      "operatingSystem": "Microsoft Excel, Google Sheets, Apple Numbers",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "1.00",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "Organization",
      "name": "NEXUS Digital Store",
      "url": siteUrl,
      "logo": `${siteUrl}/personal-growth-system-cover.svg`,
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "solution00000@outlook.com",
        "contactType": "Customer Support",
      },
    },
  ],
};

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
  verification: {
    google: "07e650b31d6d6013",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "NEXUS | 16-in-1 Personal Growth System (.xlsx)",
    description:
      "Complete life operating system for high performers. 100% offline, automated streak engine, and instant Excel download.",
    siteName: "NEXUS Digital Store",
    images: [
      {
        url: "/personal-growth-system-cover.svg",
        width: 1200,
        height: 675,
        alt: "Personal Growth System (16-in-1 Master OS)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS | 16-in-1 Personal Growth System (.xlsx)",
    description:
      "Track habits, goals, projects, and deep work in one unified Excel & Google Sheets operating system.",
    images: ["/personal-growth-system-cover.svg"],
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
