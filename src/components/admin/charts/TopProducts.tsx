"use client";

interface TopProductsProps {
  data: { name: string; quantity: number }[];
}

export default function TopProducts({ data }: TopProductsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h3 className="mb-6 text-lg font-bold text-text">Top 5 des ventes</h3>
        <p className="text-text-light">Aucune donnée disponible</p>
      </div>
    );
  }

  const maxQuantity = Math.max(...data.map((d) => d.quantity)) || 1;
  const opacities = ["100%", "80%", "60%", "40%", "20%"];

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <h3 className="mb-6 text-lg font-bold text-text">Top 5 des ventes</h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercent = (item.quantity / maxQuantity) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text truncate">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-text-light">
                  {item.quantity}
                </span>
              </div>

              <div className="h-8 w-full rounded-lg bg-gray-100">
                <div
                  className="h-full rounded-lg bg-primary transition-all duration-300"
                  style={{
                    width: `${widthPercent}%`,
                    opacity: opacities[index],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
