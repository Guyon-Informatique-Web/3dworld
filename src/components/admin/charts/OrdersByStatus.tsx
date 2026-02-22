"use client";

interface OrdersByStatusProps {
  data: {
    status: string;
    count: number;
    label: string;
    color: string;
  }[];
}

export default function OrdersByStatus({ data }: OrdersByStatusProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h3 className="mb-6 text-lg font-bold text-text">Commandes par statut</h3>
        <p className="text-text-light">Aucune donnée disponible</p>
      </div>
    );
  }

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <h3 className="mb-6 text-lg font-bold text-text">Commandes par statut</h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercent = (item.count / totalOrders) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-text-light">
                  {item.count}
                </span>
              </div>

              <div className="h-6 w-full rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                  style={{
                    width: `${widthPercent}%`,
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
