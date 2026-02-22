"use client";

import Link from "next/link";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import type { OrderStatus } from "@/generated/prisma/client";

interface RecentOrdersProps {
  orders: {
    id: string;
    name: string;
    totalAmount: string;
    status: OrderStatus;
    createdAt: string;
  }[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h3 className="mb-6 text-lg font-bold text-text">Commandes récentes</h3>
        <p className="text-text-light">Aucune commande</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <h3 className="mb-6 text-lg font-bold text-text">Commandes récentes</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-text-light">
                #ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-text-light">
                Client
              </th>
              <th className="px-4 py-3 text-left font-semibold text-text-light">
                Montant
              </th>
              <th className="px-4 py-3 text-left font-semibold text-text-light">
                Statut
              </th>
              <th className="px-4 py-3 text-left font-semibold text-text-light">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="font-mono text-xs font-semibold text-primary hover:underline"
                  >
                    {order.id.substring(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-text truncate max-w-xs">
                  {order.name}
                </td>
                <td className="px-4 py-3 font-semibold text-text">
                  {order.totalAmount}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-text-light">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
