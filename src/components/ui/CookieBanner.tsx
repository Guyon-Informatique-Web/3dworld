"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Banneau de consentement RGPD pour les cookies
 * Affiche une bannière fixe en bas de page jusqu'à ce que l'utilisateur accepte ou refuse
 * Stocke le choix dans localStorage avec la clé "3dworld_cookie_consent"
 */
export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier le consentement existant après montage du composant
    const consent = localStorage.getItem("3dworld_cookie_consent");
    if (!consent) {
      // Délai de 1s avant d'afficher la bannière
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("3dworld_cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleRefuse = () => {
    localStorage.setItem("3dworld_cookie_consent", "refused");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:bottom-6 md:left-1/2 md:-translate-x-1/2"
        >
          <div className="w-full max-w-4xl rounded-none bg-white shadow-2xl md:rounded-2xl md:border md:border-gray-200">
            <div className="flex flex-col items-start gap-4 p-4 md:flex-row md:items-center md:gap-4 md:p-6">
              {/* Cookie Icon */}
              <div className="flex-shrink-0">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-accent"
                  aria-hidden="true"
                >
                  <circle cx="6" cy="6" r="2" />
                  <circle cx="16" cy="6" r="2" />
                  <circle cx="6" cy="16" r="2" />
                  <circle cx="16" cy="16" r="2" />
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Texte et lien */}
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-text md:text-base">
                  Nous utilisons des cookies pour améliorer votre expérience. En
                  continuant votre navigation, vous acceptez notre utilisation des
                  cookies.{" "}
                  <Link
                    href="/politique-cookies"
                    className="font-semibold text-primary transition-colors hover:text-primary-dark"
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>

              {/* Boutons */}
              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                <button
                  onClick={handleRefuse}
                  className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-text-light transition-colors hover:border-primary hover:text-primary md:whitespace-nowrap"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark md:whitespace-nowrap"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
