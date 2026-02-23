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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.3d-world.online";
  const articleUrl = `${appUrl}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | 3D World Blog`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      url: articleUrl,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: {
      canonical: articleUrl,
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

  // Données structurées Schema.org pour le SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "3D World",
    },
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
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
    </>
  );
}
