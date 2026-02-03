import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ALAFIA - Votre Santé à Lomé",
  description: "Application de santé pour Lomé : pharmacies de garde, recherche de médicaments, chatbot médical, suivi de santé personnalisé",
  keywords: "pharmacie, Lomé, Togo, médicaments, santé, garde, chatbot médical",
  authors: [{ name: "ALAFIA Team" }],
  openGraph: {
    title: "ALAFIA - Votre Santé à Lomé",
    description: "Trouvez rapidement des pharmacies de garde et des médicaments à Lomé",
    type: "website",
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
