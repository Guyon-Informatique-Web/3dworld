// Layout du site vitrine — inclut le Header et Footer publics
// Toutes les pages non-admin passent par ce layout
// CartProvider permet a toutes les pages d'acceder au panier

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

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
    </CartProvider>
  );
}
