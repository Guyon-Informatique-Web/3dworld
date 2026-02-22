// Page publique du blog — affiche la liste des articles publiés
// Server Component : charge les articles depuis Prisma

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Découvrez nos articles sur l'impression 3D, les conseils, les astuces et les actualités de 3D World.",
};

export default async function BlogPage() {
  // Charger les articles publiés, triés par date de publication décroissante
  const blogPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="pt-28 pb-12">
      <SectionTitle
        title="Blog"
        subtitle="Actualités et conseils sur l'impression 3D"
      />

      <div className="mx-auto max-w-6xl px-4">
        {blogPosts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-text-light">
              Aucun article pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                publishedAt={post.publishedAt!}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
