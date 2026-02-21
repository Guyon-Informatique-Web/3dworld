// Carte de statistique pour le tableau de bord admin
// Affiche un titre, une valeur principale, une icone et un trend optionnel

interface StatCardProps {
  /** Intitulé de la statistique */
  title: string;
  /** Valeur affichée (nombre ou texte formaté) */
  value: string | number;
  /** Icone SVG à afficher */
  icon: React.ReactNode;
  /** Tendance optionnelle (ex: "+12%" ou "-3%") */
  trend?: string;
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  // Déterminer la couleur du trend selon le signe
  const trendColor = trend?.startsWith("-")
    ? "text-red-500"
    : "text-green-600";

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          {/* Titre de la statistique */}
          <p className="text-sm font-medium text-text-light">{title}</p>
          {/* Valeur principale */}
          <p className="text-3xl font-bold text-text">{value}</p>
          {/* Tendance optionnelle */}
          {trend && (
            <p className={`text-sm font-medium ${trendColor}`}>{trend}</p>
          )}
        </div>
        {/* Icone avec fond coloré */}
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-alt text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
