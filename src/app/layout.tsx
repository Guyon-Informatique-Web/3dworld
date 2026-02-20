import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  metadataBase: new URL("https://www.3d-world.online"),
  title: {
    default: "3D World | Impression 3D sur mesure",
    template: "%s | 3D World",
  },
  description:
    "Impression 3D sur commande et créations originales. Donnez vie à vos idées avec 3D World. Devis gratuit.",
  keywords: [
    "impression 3D",
    "impression 3D sur commande",
    "objets 3D",
    "prototypage 3D",
    "créations 3D",
    "figurines 3D",
    "impression 3D France",
  ],
  authors: [{ name: "3D World" }],
  creator: "3D World",
  /*
   * TODO: Ajouter une image OG manuellement dans public/og-image.jpg (1200x630px).
   * La generation dynamique via opengraph-image.tsx n'est pas compatible
   * avec l'export statique (output: "export").
   */
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.3d-world.online",
    siteName: "3D World",
    title: "3D World | Impression 3D sur mesure",
    description:
      "Impression 3D sur commande et créations originales. Donnez vie à vos idées avec 3D World.",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D World | Impression 3D sur mesure",
    description: "Impression 3D sur commande et créations originales.",
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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text`}
      >
        {/* Données structurées Schema.org pour le référencement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "3D World",
              description:
                "Impression 3D sur commande et créations originales.",
              url: "https://www.3d-world.online",
              email: "contact@3dworld.fr",
              telephone: "01 23 45 67 89",
              address: {
                "@type": "PostalAddress",
                addressCountry: "FR",
              },
              sameAs: [
                "https://instagram.com",
                "https://facebook.com",
                "https://tiktok.com",
              ],
              priceRange: "€€",
            }),
          }}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
