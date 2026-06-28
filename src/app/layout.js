import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Clinical Portfolio",
  description: "Advanced Dentistry & Esthetics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
