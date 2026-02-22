// Client component pour la page admin coupons

"use client";

import { useState } from "react";
import CouponList from "@/components/admin/coupons/CouponList";
import CouponForm from "@/components/admin/coupons/CouponForm";

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

interface CouponsPageClientProps {
  initialCoupons: CouponItem[];
}

export default function CouponsPageClient({ initialCoupons }: CouponsPageClientProps) {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // Recharger les coupons après édition
  async function handleEditClose() {
    setEditingCoupon(null);
    // Revalidate the page to get fresh data
    try {
      const response = await fetch("/api/admin/coupons");
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error("Erreur lors du rechargement:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulaire d'édition/création */}
      {editingCoupon !== null && (
        <div>
          <CouponForm
            coupon={editingCoupon.id ? editingCoupon : undefined}
            onClose={handleEditClose}
          />
        </div>
      )}

      {/* Liste des coupons */}
      <CouponList
        coupons={coupons}
        onEditClick={(coupon) => setEditingCoupon(coupon)}
      />
    </div>
  );
}
