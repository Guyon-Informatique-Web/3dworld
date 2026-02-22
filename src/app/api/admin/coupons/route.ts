// GET /api/admin/coupons — liste les coupons pour l'admin

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

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

    // Sérialiser les Decimal en string
    const serialized = coupons.map((coupon) => ({
      ...coupon,
      discountValue: coupon.discountValue.toString(),
      minAmount: coupon.minAmount?.toString() || null,
      createdAt: coupon.createdAt.toISOString(),
      expiresAt: coupon.expiresAt?.toISOString() || null,
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Erreur fetch coupons:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des coupons." },
      { status: 500 }
    );
  }
}
