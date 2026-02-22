// Page admin coupons — liste et gestion des codes promotionnels
// Wrapper server/client component

import { prisma } from "@/lib/prisma";
import CouponsPageClient from "./page-client";

interface CouponItem {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minAmount: string | null;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default async function CouponsPage() {
  // Charger les coupons côté serveur
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      discountType: true,
      discountValue: true,
      minAmount: true,
      maxUses: true,
      currentUses: true,
      isActive: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  // Sérialiser les Decimal
  const serialized: CouponItem[] = coupons.map((coupon) => ({
    ...coupon,
    discountValue: coupon.discountValue.toString(),
    minAmount: coupon.minAmount?.toString() || null,
    createdAt: coupon.createdAt.toISOString(),
    expiresAt: coupon.expiresAt?.toISOString() || null,
  }));

  return <CouponsPageClient initialCoupons={serialized} />;
}
