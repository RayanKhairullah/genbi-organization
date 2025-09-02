import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Genbi Kota Bengkulu",
    template: "%s | Genbi Kota Bengkulu",
  },
  description: "Informasi resmi Genbi Kota Bengkulu: struktur organisasi dan dokumentasi kegiatan.",
  keywords: [
    "Genbi",
    "Kota Bengkulu",
    "Remaja",
    "Organisasi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Genbi Kota Bengkulu",
    description: "Informasi resmi Genbi Kota Bengkulu: struktur organisasi dan kegiatan.",
    siteName: "Genbi Kota Bengkulu",
    images: [
      {
        url: "/genbilogo.svg",
        width: 1200,
        height: 630,
        alt: "Genbi Kota Bengkulu",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    site: "@genre_bengkulu",
    creator: "@genre_bengkulu",
    title: "Genbi Kota Bengkulu",
    description: "Informasi resmi Genbi Kota Bengkulu: struktur organisasi dan kegiatan.",
    images: [
      {
        url: "/genbilogo.svg",
        alt: "Genbi Kota Bengkulu",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': "large",
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: "/genbilogo.svg",
    apple: "/genbilogo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
