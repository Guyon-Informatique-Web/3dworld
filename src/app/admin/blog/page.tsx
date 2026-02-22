// Page admin des articles de blog — charge les données et affiche la liste
// Server Component : les données sont chargées côté serveur via Prisma

import { prisma } from "@/lib/prisma";
import BlogList from "@/components/admin/blog/BlogList";

export const metadata = {
  title: "Blog - Administration",
};

export default async function AdminBlogPage() {
  // Charger tous les articles (publiés et brouillons), triés par date de création décroissante
  const blogPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Sérialiser les dates pour les composants client
  const serializedPosts = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return <BlogList posts={serializedPosts} />;
}
