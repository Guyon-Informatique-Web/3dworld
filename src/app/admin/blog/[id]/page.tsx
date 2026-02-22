// Page d'édition d'un article de blog
// Server Component : charge l'article par ID et affiche le formulaire prérempli

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/blog/BlogForm";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Éditer article - Blog - Administration",
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;

  // Charger l'article par ID
  const blogPost = await prisma.blogPost.findUnique({
    where: { id },
  });

  // Afficher 404 si l'article n'existe pas
  if (!blogPost) {
    notFound();
  }

  // Sérialiser les données pour le composant client
  const serializedPost = {
    id: blogPost.id,
    title: blogPost.title,
    excerpt: blogPost.excerpt,
    content: blogPost.content,
    coverImage: blogPost.coverImage,
    isPublished: blogPost.isPublished,
  };

  return <BlogForm post={serializedPost} />;
}
