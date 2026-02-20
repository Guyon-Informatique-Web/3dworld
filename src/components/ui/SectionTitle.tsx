interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

/**
 * Titre de section centré avec ligne décorative en couleur primary.
 * Réutilisable sur toutes les pages du site.
 */
export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-12 flex flex-col items-center text-center">
      {/* Ligne décorative au-dessus du titre */}
      <div className="mb-4 h-1 w-16 rounded-full bg-primary" />

      <h2 className="text-3xl font-bold text-text sm:text-4xl">{title}</h2>

      {subtitle && (
        <p className="mt-3 max-w-2xl text-base text-text-light sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
