// GET /api/admin/orders/export — exporte les commandes en CSV
// Filtrable par statut et plage de dates

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";

/**
 * Formate une date au format dd/mm/yyyy
 */
function formatDateFR(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Échappe les guillemets, retours a la ligne et retours chariot pour CSV
 */
function escapeCSV(value: string): string {
  // Vérifier si on doit entourer de guillemets
  if (value.includes(",") || value.includes(";") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    // Remplacer les retours a la ligne et carriage returns par des espaces
    const cleaned = value.replace(/\r\n/g, " ").replace(/\r/g, " ").replace(/\n/g, " ");
    // Échapper les guillemets en les doublant
    return `"${cleaned.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Verifie que l'utilisateur est admin.
 * Retourne l'utilisateur s'il est autorise, sinon null.
 */
async function checkAdminAuth() {
  try {
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    const user = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    if (!user || user.role !== "ADMIN") return null;

    return user;
  } catch (error) {
    console.error("Erreur vérification admin:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verifier que c'est un admin
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    // Recuperer les parametres de filtre
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as string | null;
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    // Construire les filtres
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (fromStr || toStr) {
      where.createdAt = {};
      if (fromStr) {
        where.createdAt.gte = new Date(fromStr);
      }
      if (toStr) {
        where.createdAt.lte = new Date(toStr);
      }
    }

    // Charger les commandes avec les items
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Generer le CSV
    const bom = "\uFEFF"; // UTF-8 BOM pour Excel
    const headers = [
      "ID",
      "Date",
      "Client",
      "Email",
      "Téléphone",
      "Statut",
      "Méthode livraison",
      "Sous-total",
      "Livraison",
      "Réduction",
      "Total",
      "Produits",
    ];

    const rows = orders.map((order) => {
      // Formatter les produits : "Produit x2, Autre produit x1"
      const productsList = order.items
        .map((item) => {
          const quantity = item.quantity > 1 ? ` x${item.quantity}` : "";
          return `${item.product.name}${quantity}`;
        })
        .join(", ");

      const subtotal = Number(order.totalAmount) - Number(order.shippingCost) + Number(order.discountAmount);

      return [
        order.id.slice(0, 8).toUpperCase(),
        formatDateFR(order.createdAt),
        escapeCSV(order.name),
        escapeCSV(order.email),
        escapeCSV(order.phone || ""),
        order.status,
        escapeCSV(order.shippingMethod),
        subtotal.toFixed(2),
        Number(order.shippingCost).toFixed(2),
        Number(order.discountAmount).toFixed(2),
        Number(order.totalAmount).toFixed(2),
        escapeCSV(productsList),
      ].join(";");
    });

    const csv =
      bom + headers.join(";") + "\n" + rows.join("\n");

    // Generer le nom du fichier avec la date actuelle
    const today = new Date();
    const dateStr = formatDateFR(today).replace(/\//g, "-");
    const filename = `commandes-3dworld-${dateStr}.csv`;

    // Retourner en tant que piece jointe
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Erreur export commandes:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'export des commandes." },
      { status: 500 }
    );
  }
}
