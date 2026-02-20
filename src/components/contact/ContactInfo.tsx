import AnimatedSection from "@/components/ui/AnimatedSection";

/**
 * Colonne d'informations de contact :
 * email, téléphone, localisation, horaires + réseaux sociaux.
 */
export default function ContactInfo() {
  return (
    <AnimatedSection delay={0.2}>
      <div className="rounded-2xl bg-bg-alt p-8">
        {/* Informations de contact */}
        <h3 className="mb-6 text-lg font-semibold text-text">
          Nos coordonnées
        </h3>

        <ul className="flex flex-col gap-5">
          {/* Email */}
          <li className="flex items-start gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <div>
              <p className="text-sm font-medium text-text">Email</p>
              <a
                href="mailto:contact@3dworld.fr"
                className="text-sm text-text-light transition-colors hover:text-primary"
              >
                contact@3dworld.fr
              </a>
            </div>
          </li>

          {/* Téléphone */}
          <li className="flex items-start gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-text">Téléphone</p>
              <a
                href="tel:+33123456789"
                className="text-sm text-text-light transition-colors hover:text-primary"
              >
                01 23 45 67 89
              </a>
            </div>
          </li>

          {/* Localisation */}
          <li className="flex items-start gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="text-sm font-medium text-text">Localisation</p>
              <p className="text-sm text-text-light">France</p>
            </div>
          </li>

          {/* Horaires */}
          <li className="flex items-start gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-sm font-medium text-text">Horaires</p>
              <p className="text-sm text-text-light">Lun - Ven : 9h - 18h</p>
            </div>
          </li>
        </ul>

        {/* Séparateur visuel */}
        <div className="my-6 h-px w-full bg-gray-200" />

        {/* Réseaux sociaux */}
        <h3 className="mb-4 text-lg font-semibold text-text">Suivez-nous</h3>

        <div className="flex items-center gap-4">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-2.5 text-text-light shadow-sm transition-colors hover:text-primary"
            aria-label="Instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-2.5 text-text-light shadow-sm transition-colors hover:text-primary"
            aria-label="Facebook"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-2.5 text-text-light shadow-sm transition-colors hover:text-primary"
            aria-label="TikTok"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
