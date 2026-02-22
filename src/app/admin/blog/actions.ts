// Server Actions pour le CRUD des articles de blog
// Création, modification, suppression et publication/dépublication des articles

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
 * Génère un slug à partir d'un titre :
 * - convertit en minuscules
 * - retire les accents et caractères spéciaux
 * - remplace les espaces par des tirets
 * - supprime les tirets en début/fin
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Crée un nouvel article de blog.
 * Génère le slug automatiquement depuis le titre.
 * Si isPublished est vrai, définit publishedAt à la date actuelle.
 */
export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const title = formData.get("title");
  const excerpt = formData.get("excerpt");
  const content = formData.get("content");
  const coverImage = formData.get("coverImage");
  const isPublished = formData.get("isPublished") === "true";

  // Validation du titre (obligatoire)
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return { success: false, error: "Le titre de l'article est obligatoire." };
  }

  // Validation de l'excerpt (obligatoire)
  if (!excerpt || typeof excerpt !== "string" || excerpt.trim().length === 0) {
    return { success: false, error: "L'extrait est obligatoire." };
  }

  // Validation du contenu (obligatoire)
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return { success: false, error: "Le contenu de l'article est obligatoire." };
  }

  // Génerer le slug
  const trimmedTitle = title.trim();
  let slug = generateSlug(trimmedTitle);

  if (slug.length === 0) {
    return { success: false, error: "Le titre génère un slug invalide. Utilisez des caractères alphanumériques." };
  }

  // Vérifier l'unicité du slug, ajouter un suffixe si nécessaire
  const existingPost = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (existingPost) {
    // Ajouter un suffixe numérique pour rendre le slug unique
    let counter = 2;
    let uniqueSlug = `${slug}-${counter}`;
    while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
    slug = uniqueSlug;
  }

  // Créer l'article
  const coverImageUrl = coverImage && typeof coverImage === "string" && coverImage.trim().length > 0
    ? coverImage.trim()
    : null;

  await prisma.blogPost.create({
    data: {
      title: trimmedTitle,
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImageUrl,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  return { success: true };
}

/**
 * Met à jour un article de blog existant.
 * Régénère le slug si le titre a changé.
 * Si on publie l'article et qu'il n'a pas encore de publishedAt, on le définit.
 */
export async function updateBlogPost(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant d'article manquant." };
  }

  const title = formData.get("title");
  const excerpt = formData.get("excerpt");
  const content = formData.get("content");
  const coverImage = formData.get("coverImage");
  const isPublished = formData.get("isPublished") === "true";

  // Validation du titre (obligatoire)
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return { success: false, error: "Le titre de l'article est obligatoire." };
  }

  // Validation de l'excerpt (obligatoire)
  if (!excerpt || typeof excerpt !== "string" || excerpt.trim().length === 0) {
    return { success: false, error: "L'extrait est obligatoire." };
  }

  // Validation du contenu (obligatoire)
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return { success: false, error: "Le contenu de l'article est obligatoire." };
  }

  // Vérifier que l'article existe
  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, isPublished: true, publishedAt: true },
  });

  if (!existingPost) {
    return { success: false, error: "Article introuvable." };
  }

  // Génerer le slug
  const trimmedTitle = title.trim();
  let slug = generateSlug(trimmedTitle);

  if (slug.length === 0) {
    return { success: false, error: "Le titre génère un slug invalide. Utilisez des caractères alphanumériques." };
  }

  // Vérifier l'unicité du slug (sauf si c'est le même article)
  const slugConflict = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (slugConflict && slugConflict.id !== id) {
    // Ajouter un suffixe numérique pour rendre le slug unique
    let counter = 2;
    let uniqueSlug = `${slug}-${counter}`;
    while (true) {
      const conflict = await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } });
      if (!conflict || conflict.id === id) break;
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
    slug = uniqueSlug;
  }

  // Déterminer publishedAt
  let publishedAt = existingPost.publishedAt;
  if (isPublished && !existingPost.isPublished) {
    // On publie l'article pour la première fois
    publishedAt = new Date();
  } else if (!isPublished) {
    // On dépublie l'article
    publishedAt = null;
  }

  const coverImageUrl = coverImage && typeof coverImage === "string" && coverImage.trim().length > 0
    ? coverImage.trim()
    : null;

  // Mettre à jour l'article
  await prisma.blogPost.update({
    where: { id },
    data: {
      title: trimmedTitle,
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImageUrl,
      isPublished,
      publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");

  return { success: true };
}

/**
 * Supprime un article de blog (hard delete).
 */
export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant d'article manquant." };
  }

  // Vérifier que l'article existe
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    return { success: false, error: "Article introuvable." };
  }

  // Supprimer l'article
  await prisma.blogPost.delete({
    where: { id },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  return { success: true };
}

/**
 * Bascule la publication d'un article.
 * Si on publie et qu'il n'a pas de publishedAt, on le définit à la date actuelle.
 */
export async function togglePublished(id: string): Promise<ActionResult> {
  await requireAdmin();

  if (!id || id.trim().length === 0) {
    return { success: false, error: "Identifiant d'article manquant." };
  }

  // Vérifier que l'article existe
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, isPublished: true, publishedAt: true },
  });

  if (!post) {
    return { success: false, error: "Article introuvable." };
  }

  // Déterminer le nouvel état
  const newIsPublished = !post.isPublished;
  let newPublishedAt = post.publishedAt;

  if (newIsPublished && !post.publishedAt) {
    newPublishedAt = new Date();
  } else if (!newIsPublished) {
    newPublishedAt = null;
  }

  // Mettre à jour
  await prisma.blogPost.update({
    where: { id },
    data: {
      isPublished: newIsPublished,
      publishedAt: newPublishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  return { success: true };
}
