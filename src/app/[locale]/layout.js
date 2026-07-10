import { Inter, Outfit, Cairo } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
      <head>
        {/* On-Screen Error Catcher for Mobile Debugging */}
        <script dangerouslySetInnerHTML={{
          __html: `
            function showMobileError(title, details, bg, color) {
              var errorDiv = document.createElement('div');
              errorDiv.style.position = 'fixed';
              errorDiv.style.top = '0';
              errorDiv.style.left = '0';
              errorDiv.style.width = '100%';
              errorDiv.style.background = bg;
              errorDiv.style.color = color;
              errorDiv.style.zIndex = '999999';
              errorDiv.style.padding = '20px';
              errorDiv.style.fontSize = '14px';
              errorDiv.style.fontFamily = 'monospace';
              errorDiv.style.wordBreak = 'break-word';
              errorDiv.innerHTML = '<strong>' + title + '</strong><br>' + details;
              
              if (document.body) {
                document.body.appendChild(errorDiv);
              } else {
                document.addEventListener('DOMContentLoaded', function() {
                  document.body.appendChild(errorDiv);
                });
              }
            }

            window.onerror = function(message, source, lineno, colno, error) {
              var stack = error && error.stack ? error.stack : 'No stack';
              showMobileError('FATAL ERROR:', message + '<br><br>Stack:<br>' + stack, 'red', 'white');
            };

            window.addEventListener('unhandledrejection', function(event) {
              var reason = event.reason && event.reason.stack ? event.reason.stack : (event.reason ? event.reason.toString() : 'Unknown');
              showMobileError('PROMISE REJECTION:', reason, 'orange', 'black');
            });
            
            // Keep the previous polyfill just in case it was helping partially
            if (typeof Promise.withResolvers === 'undefined') {
              Promise.withResolvers = function () {
                var resolve, reject;
                var promise = new Promise(function (res, rej) {
                  resolve = res;
                  reject = rej;
                });
                return { promise: promise, resolve: resolve, reject: reject };
              };
            }
          `
        }}></script>
      </head>
      <body className={fontClasses}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
