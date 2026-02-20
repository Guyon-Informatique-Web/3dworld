import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Page introuvable",
};

/**
 * Page 404 personnalisée.
 * Affiche un message convivial en français avec un lien de retour à l'accueil.
 */
export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-[70vh] px-4">
      <AnimatedSection className="text-center max-w-lg">
        {/* Cube 3D décoratif */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-6 opacity-60"
          aria-hidden="true"
        >
          <path d="M16 3L29 10L16 17L3 10L16 3Z" fill="#a78bfa" />
          <path d="M3 10L16 17V29L3 22V10Z" fill="#7c3aed" />
          <path d="M29 10L16 17V29L29 22V10Z" fill="#5b21b6" />
        </svg>

        {/* Code erreur */}
        <p className="text-7xl font-extrabold text-primary mb-4">404</p>

        {/* Titre */}
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
          Oops ! Page introuvable
        </h1>

        {/* Description */}
        <p className="text-text-light mb-8 text-lg">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        {/* Bouton retour */}
        <Link
          href="/"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
        >
          Retour à l&apos;accueil
        </Link>
      </AnimatedSection>
    </section>
  );
}
