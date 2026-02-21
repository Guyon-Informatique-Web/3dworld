// Server Actions pour le CRUD des produits
// Creation, modification, suppression et activation/desactivation des produits

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
 * Cree un nouveau produit.
 * Genere le slug automatiquement depuis le nom.
 * Stocke les images sous forme de tableau d'URLs.
 */
export async function createProduct(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const categoryId = formData.get("categoryId");
  const hasVariants = formData.get("hasVariants") === "true";
  // Les images sont envoyees sous forme de JSON (tableau d'URLs)
  const imagesJson = formData.get("images");

  // Validation du nom (obligatoire)
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Le nom du produit est obligatoire." };
  }

  // Validation de la description (obligatoire)
  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return { success: false, error: "La description du produit est obligatoire." };
  }

  // Validation du prix (obligatoire, >= 0)
  if (!price || typeof price !== "string") {
    return { success: false, error: "Le prix du produit est obligatoire." };
  }

  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue < 0) {
    return { success: false, error: "Le prix doit etre un nombre positif." };
  }

  // Validation de la categorie (obligatoire)
  if (!categoryId || typeof categoryId !== "string" || categoryId.trim().length === 0) {
    return { success: false, error: "La categorie est obligatoire." };
  }

  // Verification que la categorie existe
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { success: false, error: "Categorie introuvable." };
  }

  // Parser les images
  let images: string[] = [];
  if (imagesJson && typeof imagesJson === "string") {
    try {
      images = JSON.parse(imagesJson) as string[];
    } catch {
      return { success: false, error: "Format d'images invalide." };
    }
  }

  // Generer le slug
  const trimmedName = name.trim();
  let slug = generateSlug(trimmedName);

  if (slug.length === 0) {
    return { success: false, error: "Le nom genere un slug invalide. Utilisez des caracteres alphanumeriques." };
  }

  // Verifier l'unicite du slug, ajouter un suffixe si necessaire
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    // Ajouter un suffixe numerique pour rendre le slug unique
    let counter = 2;
    let uniqueSlug = `${slug}-${counter}`;
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
    slug = uniqueSlug;
  }

  // Creer le produit
  await prisma.product.create({
    data: {
      name: trimmedName,
      slug,
      description: description.trim(),
      price: priceValue,
      images,
      hasVariants,
      categoryId,
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Met a jour un produit existant.
 * Regenere le slug si le nom a change.
 */
export async function updateProduct(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de produit manquant." };
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const categoryId = formData.get("categoryId");
  const hasVariants = formData.get("hasVariants") === "true";
  const imagesJson = formData.get("images");

  // Validation du nom (obligatoire)
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Le nom du produit est obligatoire." };
  }

  // Validation de la description (obligatoire)
  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return { success: false, error: "La description du produit est obligatoire." };
  }

  // Validation du prix (obligatoire, >= 0)
  if (!price || typeof price !== "string") {
    return { success: false, error: "Le prix du produit est obligatoire." };
  }

  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue < 0) {
    return { success: false, error: "Le prix doit etre un nombre positif." };
  }

  // Validation de la categorie (obligatoire)
  if (!categoryId || typeof categoryId !== "string" || categoryId.trim().length === 0) {
    return { success: false, error: "La categorie est obligatoire." };
  }

  // Verifier que le produit existe
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    return { success: false, error: "Produit introuvable." };
  }

  // Verification que la categorie existe
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { success: false, error: "Categorie introuvable." };
  }

  // Parser les images
  let images: string[] = [];
  if (imagesJson && typeof imagesJson === "string") {
    try {
      images = JSON.parse(imagesJson) as string[];
    } catch {
      return { success: false, error: "Format d'images invalide." };
    }
  }

  // Generer le slug
  const trimmedName = name.trim();
  let slug = generateSlug(trimmedName);

  if (slug.length === 0) {
    return { success: false, error: "Le nom genere un slug invalide. Utilisez des caracteres alphanumeriques." };
  }

  // Verifier l'unicite du slug (sauf si c'est le meme produit)
  const slugConflict = await prisma.product.findUnique({
    where: { slug },
  });

  if (slugConflict && slugConflict.id !== id) {
    // Ajouter un suffixe numerique pour rendre le slug unique
    let counter = 2;
    let uniqueSlug = `${slug}-${counter}`;
    while (true) {
      const conflict = await prisma.product.findUnique({ where: { slug: uniqueSlug } });
      if (!conflict || conflict.id === id) break;
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
    slug = uniqueSlug;
  }

  // Mettre a jour le produit
  await prisma.product.update({
    where: { id },
    data: {
      name: trimmedName,
      slug,
      description: description.trim(),
      price: priceValue,
      images,
      hasVariants,
      categoryId,
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${id}`);
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Supprime un produit.
 * Si des commandes sont liees : desactivation (soft delete via isActive=false).
 * Sinon : suppression definitive (hard delete).
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de produit manquant." };
  }

  // Verifier que le produit existe avec le nombre de commandes liees
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });

  if (!product) {
    return { success: false, error: "Produit introuvable." };
  }

  if (product._count.orderItems > 0) {
    // Soft delete : desactiver le produit car des commandes y sont liees
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  } else {
    // Hard delete : aucune commande liee, on peut supprimer definitivement
    await prisma.product.delete({
      where: { id },
    });
  }

  revalidatePath("/admin/produits");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Active ou desactive un produit.
 * Inverse la valeur actuelle de isActive.
 */
export async function toggleProductActive(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant de produit manquant." };
  }

  // Verifier que le produit existe
  const product = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!product) {
    return { success: false, error: "Produit introuvable." };
  }

  // Inverser le statut
  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });

  revalidatePath("/admin/produits");
  revalidatePath("/boutique");

  return { success: true };
}
