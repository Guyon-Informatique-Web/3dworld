// Squelette de chargement pour la page blog

export default function BlogLoading() {
  return (
    <section className="pt-28 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Titre squelette */}
        <div className="mb-8 text-center">
          <div className="mx-auto h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded bg-gray-100" />
        </div>

        {/* Grille articles blog squelette */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white"
            >
              <div className="h-48 animate-pulse bg-gray-200" />
              <div className="p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="mt-4 h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
