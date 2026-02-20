"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import MobileMenu from "@/components/layout/MobileMenu";

/** Liens de navigation principaux */
const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Realisations", href: "/realisations" },
  { label: "A propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Header fixe avec navigation responsive.
 * Transparent en haut de page, fond blanc + ombre au scroll.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  /* Detection du scroll pour changer le style du header */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    /* Verifier l'etat initial au montage */
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Bloquer le scroll du body quand le menu mobile est ouvert */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo />

          {/* Navigation desktop */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-text-light hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bouton CTA desktop + Bouton hamburger mobile */}
          <div className="flex items-center gap-3">
            {/* CTA desktop */}
            <Link
              href="/contact"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark md:inline-block"
            >
              Devis gratuit
            </Link>

            {/* Bouton hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-light transition-colors hover:text-primary md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Menu mobile */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
        currentPath={pathname}
      />
    </>
  );
}
