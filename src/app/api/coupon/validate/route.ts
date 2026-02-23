// POST /api/coupon/validate — valide un code coupon

import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

interface ValidateBody {
  code: string;
  subtotal: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidateBody;

    // Validation basique
    if (!body.code || !body.subtotal) {
      return NextResponse.json(
        { valid: false, error: "Code et sous-total sont obligatoires." },
        { status: 400 }
      );
    }

    // Validation du sous-total : doit être un nombre positif
    if (typeof body.subtotal !== "number" || body.subtotal <= 0 || !isFinite(body.subtotal)) {
      return NextResponse.json(
        { valid: false, error: "Le sous-total doit être un nombre positif." },
        { status: 400 }
      );
    }

    // Valider le coupon
    const result = await validateCoupon(body.code, body.subtotal);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur validation coupon API:", error);
    return NextResponse.json(
      { valid: false, error: "Erreur lors de la validation du coupon." },
      { status: 500 }
    );
  }
}
