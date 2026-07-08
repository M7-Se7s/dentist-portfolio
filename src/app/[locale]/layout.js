import { Inter, Outfit, Cairo } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

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
  title: "Clinical Portfolio",
  description: "Advanced Dentistry & Esthetics",
  robots: {
    index: false,
    follow: false,
  },
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
      <body className={fontClasses}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
