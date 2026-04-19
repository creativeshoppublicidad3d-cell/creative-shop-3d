import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Shop 3D — Letreros y Publicidad en Tulancingo",
  description: "Letras 3D, letreros neón flex, acrílico personalizado y glorificadores en Tulancingo, Hidalgo. Solicita tu cotización gratis.",
  keywords: "letreros neón, letras 3D, publicidad Tulancingo, acrílico personalizado, glorificadores Hidalgo",
  openGraph: {
    title: "Creative Shop 3D — Publicidad Visual en Tulancingo",
    description: "Soluciones visuales que hacen brillar tu marca. Cotiza gratis.",
    url: "https://creative-shop-3d.vercel.app",
    siteName: "Creative Shop 3D",
    locale: "es_MX",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
