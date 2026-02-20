import Link from "next/link";

interface LogoProps {
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Logo 3D World avec icone cube 3D stylise et texte.
 * Utilise un SVG inline pour le cube isometrique.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* Icone cube 3D isometrique */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Face superieure du cube */}
        <path
          d="M18 4L32 12L18 20L4 12L18 4Z"
          fill="#a78bfa"
          stroke="#7c3aed"
          strokeWidth="1"
        />
        {/* Face gauche du cube */}
        <path
          d="M4 12L18 20V32L4 24V12Z"
          fill="#7c3aed"
          stroke="#5b21b6"
          strokeWidth="1"
        />
        {/* Face droite du cube */}
        <path
          d="M32 12L18 20V32L32 24V12Z"
          fill="#5b21b6"
          stroke="#5b21b6"
          strokeWidth="1"
        />
      </svg>

      {/* Texte du logo */}
      <span className="text-xl font-bold tracking-tight">
        <span className="text-primary">3D</span>
        <span className="text-text"> World</span>
      </span>
    </Link>
  );
}
