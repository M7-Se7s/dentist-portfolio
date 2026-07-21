import { Inter, Outfit, Cairo } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import './polyfill';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: 'swap',
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Dr. Mohamed Shabaan | Clinical Portfolio",
  description: "Advanced Dentistry & Esthetics",
  openGraph: {
    title: "Dr. Mohamed Shabaan | Clinical Portfolio",
    description: "Advanced Dentistry & Esthetics",
    url: "https://dentist-portfolio-fawn.vercel.app",
    siteName: "Dr. Mohamed Shabaan",
    images: [
      {
        url: "https://dentist-portfolio-fawn.vercel.app/logo.png",
        width: 800,
        height: 600,
        alt: "Dr. Mohamed Shabaan Logo",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Mohamed Shabaan | Clinical Portfolio",
    description: "Advanced Dentistry & Esthetics",
    images: ["https://dentist-portfolio-fawn.vercel.app/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Apply the arabic font class only if locale is Arabic, else apply Inter & Outfit.
  const fontClasses = locale === 'ar'
    ? cairo.variable
    : `${inter.variable} ${outfit.variable}`;

  return (
    <html lang={locale} dir={dir}>
      <head>
      </head>
      <body className={fontClasses}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
