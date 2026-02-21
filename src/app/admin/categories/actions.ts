// Server Actions pour le CRUD des categories
// Creation, modification, suppression et reordonnancement des categories

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
 * Genere un slug a partir d'un nom :
 * - convertit en minuscules
 * - retire les accents et caracteres speciaux
 * - remplace les espaces par des tirets
 * - supprime les tirets en debut/fin
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
 * Cree une nouvelle categorie.
 * Genere le slug automatiquement depuis le nom.
 */
export async function createCategory(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name");
  const description = formData.get("description");
  const isActive = formData.get("isActive") === "true";

  // Validation du nom (obligatoire)
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Le nom de la categorie est obligatoire." };
  }

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  if (slug.length === 0) {
    return { success: false, error: "Le nom genere un slug invalide. Utilisez des caracteres alphanumeriques." };
  }

  // Verifier l'unicite du slug
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    return { success: false, error: `Une categorie avec le slug "${slug}" existe deja.` };
  }

  // Determiner l'ordre : placer en dernier
  const lastCategory = await prisma.category.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

  // Creer la categorie
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
 * Met a jour une categorie existante.
 * Regenere le slug si le nom a change.
 */
export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  // Verification que l'id est fourni
  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de categorie manquant." };
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const isActive = formData.get("isActive") === "true";

  // Validation du nom (obligatoire)
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Le nom de la categorie est obligatoire." };
  }

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  if (slug.length === 0) {
    return { success: false, error: "Le nom genere un slug invalide. Utilisez des caracteres alphanumeriques." };
  }

  // Verifier que la categorie existe
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return { success: false, error: "Categorie introuvable." };
  }

  // Verifier l'unicite du slug (sauf si c'est la meme categorie)
  const slugConflict = await prisma.category.findUnique({
    where: { slug },
  });

  if (slugConflict && slugConflict.id !== id) {
    return { success: false, error: `Une autre categorie utilise deja le slug "${slug}".` };
  }

  // Mettre a jour la categorie
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
 * Supprime une categorie.
 * Refuse la suppression si des produits sont lies a cette categorie.
 */
export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de categorie manquant." };
  }

  // Verifier que la categorie existe
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return { success: false, error: "Categorie introuvable." };
  }

  // Verifier qu'aucun produit n'est lie
  if (category._count.products > 0) {
    return {
      success: false,
      error: `Impossible de supprimer cette categorie : ${category._count.products} produit(s) y sont rattache(s). Deplacez-les d'abord.`,
    };
  }

  // Supprimer la categorie
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Reordonne les categories selon l'ordre du tableau d'identifiants.
 * L'index dans le tableau correspond a la nouvelle valeur de `order`.
 */
export async function reorderCategories(ids: string[]): Promise<ActionResult> {
  await requireAdmin();

  if (!ids || ids.length === 0) {
    return { success: false, error: "Liste d'identifiants vide." };
  }

  // Mettre a jour l'ordre de chaque categorie dans une transaction
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
