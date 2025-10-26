import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Wash Pro - Lavage Auto Professionnel",
  description: "Service professionnel de lavage automobile à Marseille. Lavage extérieur, intérieur, polissage et protection céramique. Votre véhicule mérite le meilleur.",
  keywords: ["lavage auto", "car wash", "nettoyage voiture", "polissage", "protection céramique", "Marseille"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
