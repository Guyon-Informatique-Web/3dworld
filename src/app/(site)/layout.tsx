// Layout du site vitrine — inclut le Header et Footer publics
// Toutes les pages non-admin passent par ce layout
// CartProvider permet a toutes les pages d'acceder au panier

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/ui/CookieBanner";
import { CartProvider } from "@/context/CartContext";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.3d-world.online";
const siteName = "3D World";

// Métadonnées par défaut pour le site
export const metadata: Metadata = {
  title: {
    default: "3D World - Impression 3D, Services et Produits",
    template: "%s | 3D World",
  },
  description:
    "3D World : solutions d'impression 3D, services professionnels et produits de qualité pour vos projets",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "3D World",
    description:
      "3D World : solutions d'impression 3D, services professionnels et produits de qualité",
    siteName,
    locale: "fr_FR",
    type: "website",
    url: appUrl,
    images: [
      {
        url: `${appUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "3D World - Impression 3D et Services",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D World",
    description:
      "3D World : solutions d'impression 3D, services professionnels et produits",
    creator: "@3dworld",
    images: [`${appUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: appUrl,
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieBanner />
    </CartProvider>
  );
}
