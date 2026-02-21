// Server Actions pour le CRUD des catégories
// Création, modification, suppression et réordonnancement des catégories

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Type de retour standard pour toutes les actions */
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Génère un slug à partir d'un nom :
 * - convertit en minuscules
 * - retire les accents et caractères spéciaux
 * - remplace les espaces par des tirets
 * - supprime les tirets en début/fin
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Crée une nouvelle catégorie.
 * Génère le slug automatiquement depuis le nom.
 */
export async function createCategory(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name");
  const description = formData.get("description");
  const isActive = formData.get("isActive") === "true";

  // Validation du nom (obligatoire)
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Le nom de la catégorie est obligatoire." };
  }

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  if (slug.length === 0) {
    return { success: false, error: "Le nom génère un slug invalide. Utilisez des caractères alphanumériques." };
  }

  // Vérifier l'unicité du slug
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    return { success: false, error: `Une catégorie avec le slug "${slug}" existe déjà.` };
  }

  // Déterminer l'ordre : placer en dernier
  const lastCategory = await prisma.category.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

  // Créer la catégorie
  await prisma.category.create({
    data: {
      name: trimmedName,
      slug,
      description: typeof description === "string" && description.trim().length > 0
        ? description.trim()
        : null,
      isActive,
      order: nextOrder,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Met à jour une catégorie existante.
 * Régénère le slug si le nom a changé.
 */
export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  // Vérification que l'id est fourni
  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de catégorie manquant." };
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const isActive = formData.get("isActive") === "true";

  // Validation du nom (obligatoire)
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Le nom de la catégorie est obligatoire." };
  }

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  if (slug.length === 0) {
    return { success: false, error: "Le nom génère un slug invalide. Utilisez des caractères alphanumériques." };
  }

  // Vérifier que la catégorie existe
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return { success: false, error: "Categorie introuvable." };
  }

  // Vérifier l'unicité du slug (sauf si c'est la même catégorie)
  const slugConflict = await prisma.category.findUnique({
    where: { slug },
  });

  if (slugConflict && slugConflict.id !== id) {
    return { success: false, error: `Une autre categorie utilise deja le slug "${slug}".` };
  }

  // Mettre à jour la catégorie
  await prisma.category.update({
    where: { id },
    data: {
      name: trimmedName,
      slug,
      description: typeof description === "string" && description.trim().length > 0
        ? description.trim()
        : null,
      isActive,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Supprime une catégorie.
 * Refuse la suppression si des produits sont liés à cette catégorie.
 */
export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de catégorie manquant." };
  }

  // Vérifier que la catégorie existe
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return { success: false, error: "Catégorie introuvable." };
  }

  // Vérifier qu'aucun produit n'est lié
  if (category._count.products > 0) {
    return {
      success: false,
      error: `Impossible de supprimer cette catégorie : ${category._count.products} produit(s) y sont rattaché(s). Déplacez-les d'abord.`,
    };
  }

  // Supprimer la catégorie
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Réordonne les catégories selon l'ordre du tableau d'identifiants.
 * L'index dans le tableau correspond à la nouvelle valeur de `order`.
 */
export async function reorderCategories(ids: string[]): Promise<ActionResult> {
  await requireAdmin();

  if (!ids || ids.length === 0) {
    return { success: false, error: "Liste d'identifiants vide." };
  }

  // Mettre à jour l'ordre de chaque catégorie dans une transaction
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePath("/admin/categories");
  revalidatePath("/boutique");

  return { success: true };
}
