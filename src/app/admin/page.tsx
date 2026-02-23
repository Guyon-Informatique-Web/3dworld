// Page tableau de bord admin — affiche les statistiques principales
// Données chargées côté serveur via Prisma (Server Component)

import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";

// Chargement lazy des graphiques lourds (Recharts)
const RevenueChart = dynamic(
  () => import("@/components/admin/charts/RevenueChart"),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

const TopProducts = dynamic(
  () => import("@/components/admin/charts/TopProducts"),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

const OrdersByStatus = dynamic(
  () => import("@/components/admin/charts/OrdersByStatus"),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

const RecentOrders = dynamic(
  () => import("@/components/admin/charts/RecentOrders"),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
    ),
  }
);

export const metadata = {
  title: "Tableau de bord",
};

/** Icone commandes du jour */
function OrderTodayIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/** Icone chiffre d'affaires */
function RevenueIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

/** Icone commandes en cours */
function PendingOrdersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/** Icone produits actifs */
function ActiveProductsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Formate un montant en euros avec séparateur de milliers.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default async function AdminDashboardPage() {
  // Calculer les bornes temporelles
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  // Charger toutes les statistiques en parallèle
  const [
    ordersToday,
    monthlyRevenue,
    pendingOrders,
    activeProducts,
    ordersLast6Months,
    orderItems,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    // 1. Commandes du jour
    prisma.order.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    }),

    // 2. Chiffre d'affaires du mois (commandes payées/en cours/expédiées/livrées)
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: startOfMonth },
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
    }),

    // 3. Commandes en cours (payées ou en traitement)
    prisma.order.count({
      where: {
        status: { in: ["PAID", "PROCESSING"] },
      },
    }),

    // 4. Produits actifs
    prisma.product.count({
      where: { isActive: true },
    }),

    // 5. Commandes des 6 derniers mois pour graphique chiffre d'affaires
    prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: { not: "CANCELLED" },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    }),

    // 6. Articles de commande pour top 5 produits
    prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: sixMonthsAgo },
          status: { not: "CANCELLED" },
        },
      },
      select: {
        quantity: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    }),

    // 7. Commandes par statut
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),

    // 8. 5 commandes récentes
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  // Extraire le CA du mois (Decimal -> number)
  const revenue = monthlyRevenue._sum.totalAmount
    ? Number(monthlyRevenue._sum.totalAmount)
    : 0;

  // Préparer données graphique chiffre d'affaires (6 derniers mois)
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const revenueByMonth: Record<string, number> = {};

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
    revenueByMonth[monthKey] = 0;
  }

  ordersLast6Months.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
    if (monthKey in revenueByMonth) {
      revenueByMonth[monthKey] += Number(order.totalAmount);
    }
  });

  const revenueChartData = Object.entries(revenueByMonth).map(
    ([monthKey, amount]) => {
      const [year, month] = monthKey.split("-");
      return {
        month: monthNames[parseInt(month)],
        revenue: amount,
      };
    }
  );

  // Préparer données top 5 produits
  const productSales: Record<string, number> = {};
  orderItems.forEach((item) => {
    const productName = item.product.name;
    productSales[productName] = (productSales[productName] || 0) + item.quantity;
  });

  const topProductsData = Object.entries(productSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Préparer données commandes par statut
  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: {
      label: "En attente",
      color: "bg-amber-500",
    },
    PAID: {
      label: "Payée",
      color: "bg-blue-500",
    },
    PROCESSING: {
      label: "En préparation",
      color: "bg-orange-500",
    },
    SHIPPED: {
      label: "Expédiée",
      color: "bg-indigo-500",
    },
    DELIVERED: {
      label: "Livrée",
      color: "bg-green-500",
    },
    CANCELLED: {
      label: "Annulée",
      color: "bg-red-500",
    },
  };

  const ordersByStatusData = ordersByStatus.map((item) => ({
    status: item.status,
    count: item._count,
    label: statusLabels[item.status]?.label || item.status,
    color: statusLabels[item.status]?.color || "bg-gray-500",
  }));

  // Préparer données commandes récentes
  const recentOrdersData = recentOrders.map((order) => ({
    id: order.id,
    name: order.name,
    totalAmount: new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(Number(order.totalAmount)),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Titre de la page */}
      <h1 className="text-2xl font-bold text-text">Tableau de bord</h1>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Commandes du jour"
          value={ordersToday}
          icon={<OrderTodayIcon />}
        />
        <StatCard
          title="CA du mois"
          value={formatCurrency(revenue)}
          icon={<RevenueIcon />}
        />
        <StatCard
          title="Commandes en cours"
          value={pendingOrders}
          icon={<PendingOrdersIcon />}
        />
        <StatCard
          title="Produits actifs"
          value={activeProducts}
          icon={<ActiveProductsIcon />}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueChartData} />
        <TopProducts data={topProductsData} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrdersByStatus data={ordersByStatusData} />
        <RecentOrders orders={recentOrdersData} />
      </div>
    </div>
  );
}
