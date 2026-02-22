"use client";

import { useState } from "react";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h3 className="mb-6 text-lg font-bold text-text">
          Chiffre d'affaires (6 derniers mois)
        </h3>
        <p className="text-text-light">Aucune donnée disponible</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue)) || 1;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <h3 className="mb-6 text-lg font-bold text-text">
        Chiffre d'affaires (6 derniers mois)
      </h3>

      <div className="flex h-80 items-end justify-between gap-3">
        {data.map((item, index) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="relative flex flex-1 flex-col items-center gap-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full mb-2 rounded-lg bg-gray-800 px-2 py-1 text-sm font-semibold text-white whitespace-nowrap z-10">
                  {formatCurrency(item.revenue)}
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t-lg bg-primary transition-all duration-200"
                style={{
                  height: `${heightPercent}%`,
                  minHeight: item.revenue > 0 ? "4px" : "0",
                }}
              />

              {/* Label */}
              <span className="text-xs font-medium text-text-light">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
