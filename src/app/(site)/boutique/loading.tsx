// Squelette de chargement pour la page boutique

export default function BoutiqueLoading() {
  return (
    <section className="pt-28 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Titre squelette */}
        <div className="mb-8 text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-3 h-4 w-96 animate-pulse rounded bg-gray-100" />
        </div>

        {/* Filtres squelette */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded-full bg-gray-200"
            />
          ))}
        </div>

        {/* Grille produits squelette */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white"
            >
              <div className="h-48 animate-pulse bg-gray-200" />
              <div className="p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
