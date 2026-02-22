// Page fiche article de blog — affiche le detail d'un article avec couverture, titre, contenu et date
// Server Component : charge l'article par slug depuis Prisma

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Charge l'article publié par slug.
 * Retourne null si l'article n'existe pas ou n'est pas publié.
 */
async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  // Article inexistant ou non publié
  if (!post || !post.isPublished) return null;

  return post;
}

/** Metadonnées dynamiques basées sur l'article */
export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | 3D World Blog`,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

/**
 * Formatte une date en format lisible (français).
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-28 pb-12">
      {/* Fil d'Ariane */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-light max-w-4xl mx-auto px-4">
        <Link href="/" className="transition-colors hover:text-primary">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/blog" className="transition-colors hover:text-primary">
          Blog
        </Link>
        <span>/</span>
        <span className="text-text font-medium">{post.title}</span>
      </nav>

      <div className="mx-auto max-w-4xl px-4">
        {/* Image de couverture */}
        {post.coverImage && (
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        {/* Titre et date */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <time className="mt-4 inline-block text-sm text-text-light">
            {formatDate(post.publishedAt || new Date())}
          </time>
        </div>

        {/* Contenu en prose */}
        <div className="prose prose-sm sm:prose max-w-none text-text-light leading-relaxed">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-4 text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Lien retour au blog */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            ← Retour au blog
          </Link>
        </div>
      </div>
    </article>
  );
}
