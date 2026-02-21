"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly highlight?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: readonly NavLink[];
  currentPath: string;
}

/**
 * Menu mobile plein ecran avec animation Framer Motion.
 * Panel qui slide depuis la droite avec overlay sombre.
 */
export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  currentPath,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sombre semi-transparent */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel lateral droit */}
          <motion.div
            className="fixed top-0 right-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            {/* En-tete du panel avec bouton fermer */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <span className="text-lg font-bold text-primary">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-text-light transition-colors hover:text-primary"
                aria-label="Fermer le menu"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Liens de navigation */}
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`block rounded-lg px-4 py-3 text-base transition-colors ${
                        currentPath === link.href
                          ? "bg-bg-alt font-bold text-primary"
                          : link.highlight
                            ? "font-semibold text-accent hover:bg-bg-alt hover:text-accent-dark"
                            : "font-medium text-text hover:bg-bg-alt hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}

                {/* Lien vers le panier */}
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                >
                  <Link
                    href="/panier"
                    onClick={onClose}
                    className={`mt-2 flex items-center gap-2 rounded-lg border-t border-gray-100 px-4 py-3 text-base font-medium transition-colors ${
                      currentPath === "/panier"
                        ? "bg-bg-alt font-bold text-primary"
                        : "text-text hover:bg-bg-alt hover:text-primary"
                    }`}
                  >
                    {/* Icone panier */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    Mon panier
                  </Link>
                </motion.li>
              </ul>
            </nav>

            {/* Bouton CTA en bas du panel */}
            <div className="border-t border-gray-100 px-6 py-6">
              <Link
                href="/contact"
                onClick={onClose}
                className="block w-full rounded-full bg-accent py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                Devis gratuit
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
