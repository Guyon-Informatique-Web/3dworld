import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Gérez votre liste de favoris",
};

async function getUserWishlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const prismaUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      wishlist: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  stock: true,
                  category: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  return prismaUser?.wishlist || null;
}

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

export default async function FavorisPage() {
  const wishlist = await getUserWishlist();

  if (!wishlist) {
    redirect("/connexion");
  }

  return (
    <section className="pt-28 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text lg:text-4xl">
            Mes favoris
          </h1>
          <p className="mt-2 text-text-light">
            {wishlist.items.length} produit{wishlist.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {wishlist.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-gray-400"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="mb-2 text-lg font-semibold text-text">
              Votre liste de favoris est vide
            </p>
            <p className="mb-6 text-text-light">
              Découvrez nos produits et ajoutez-les à vos favoris
            </p>
            <Link
              href="/boutique"
              className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Voir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.items.map((item) => (
              <Link
                key={item.id}
                href={`/boutique/${item.product.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-12 w-12 text-gray-400"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                        <line x1="12" y1="22" x2="12" y2="12" />
                      </svg>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {item.product.category.name}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {item.product.name}
                  </h3>

                  <div className="mt-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(Number(item.product.price))}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center rounded-lg bg-primary/10 py-2 text-sm font-medium text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    Voir le produit
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
