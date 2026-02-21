// Page tableau de bord admin — affiche les statistiques principales
// Données chargées côté serveur via Prisma (Server Component)

import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";

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

  // Charger toutes les statistiques en parallèle
  const [ordersToday, monthlyRevenue, pendingOrders, activeProducts] =
    await Promise.all([
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
    ]);

  // Extraire le CA du mois (Decimal -> number)
  const revenue = monthlyRevenue._sum.totalAmount
    ? Number(monthlyRevenue._sum.totalAmount)
    : 0;

  return (
    <div>
      {/* Titre de la page */}
      <h1 className="mb-6 text-2xl font-bold text-text">Tableau de bord</h1>

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
    </div>
  );
}
