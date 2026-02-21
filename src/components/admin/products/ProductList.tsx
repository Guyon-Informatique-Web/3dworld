// Liste des produits admin — table avec miniature, filtres et actions
// Client component pour gerer l'interactivite (filtres, confirmation suppression, toggle)

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, toggleProductActive } from "@/app/admin/produits/actions";

/** Donnees d'un produit avec sa categorie */
interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  isActive: boolean;
  hasVariants: boolean;
  category: {
    id: string;
    name: string;
  };
}

/** Categorie disponible pour le filtre */
interface CategoryOption {
  id: string;
  name: string;
}

/** Filtre de statut */
type StatusFilter = "all" | "active" | "inactive";

interface ProductListProps {
  /** Liste des produits charges cote serveur */
  products: ProductWithCategory[];
  /** Liste des categories pour le filtre */
  categories: CategoryOption[];
}

export default function ProductList({ products, categories }: ProductListProps) {
  // Filtre par categorie
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  // Filtre par statut
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  // Message d'erreur global
  const [error, setError] = useState<string | null>(null);
  // Identifiant du produit en cours de suppression
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Identifiant du produit en cours de toggle
  const [togglingId, setTogglingId] = useState<string | null>(null);

  /** Filtrer les produits selon les criteres selectionnes */
  const filteredProducts = products.filter((product) => {
    // Filtre par categorie
    if (categoryFilter !== "all" && product.category.id !== categoryFilter) {
      return false;
    }
    // Filtre par statut
    if (statusFilter === "active" && !product.isActive) return false;
    if (statusFilter === "inactive" && product.isActive) return false;
    return true;
  });

  /** Supprimer un produit avec confirmation */
  async function handleDelete(product: ProductWithCategory) {
    const confirmed = window.confirm(
      `Supprimer le produit "${product.name}" ? Cette action est irreversible si aucune commande n'y est liee.`
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(product.id);

    const result = await deleteProduct(product.id);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la suppression.");
    }
  }

  /** Activer/desactiver un produit */
  async function handleToggle(product: ProductWithCategory) {
    setError(null);
    setTogglingId(product.id);

    const result = await toggleProductActive(product.id);

    setTogglingId(null);

    if (!result.success) {
      setError(result.error ?? "Erreur lors de la modification du statut.");
    }
  }

  /**
   * Formate un prix en euros.
   * Utilise le format francais avec virgule decimale.
   */
  function formatPrice(price: string): string {
    const value = parseFloat(price);
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  return (
    <div className="space-y-6">
      {/* En-tete avec titre et bouton creation */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Nouveau produit
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtre par categorie */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="all">Toutes les categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Filtre par statut */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>

        {/* Compteur de resultats */}
        <span className="text-sm text-text-light">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table des produits */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-text-light">
            {products.length === 0
              ? "Aucun produit pour le moment."
              : "Aucun produit ne correspond aux filtres selectionnes."}
          </p>
          {products.length === 0 && (
            <p className="mt-1 text-sm text-text-light">
              Cliquez sur &quot;Nouveau produit&quot; pour en creer un.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-light">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    {/* Image miniature */}
                    <td className="px-6 py-4">
                      {product.images.length > 0 ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-text-light"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </td>

                    {/* Nom */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text">{product.name}</div>
                      {product.hasVariants && (
                        <span className="mt-0.5 inline-block text-xs text-text-light">
                          Avec variantes
                        </span>
                      )}
                    </td>

                    {/* Prix */}
                    <td className="px-6 py-4 text-sm font-medium text-text">
                      {formatPrice(product.price)}
                    </td>

                    {/* Categorie */}
                    <td className="px-6 py-4 text-sm text-text-light">
                      {product.category.name}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 text-center">
                      {product.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          Inactif
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Modifier */}
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg-alt transition-colors"
                        >
                          Modifier
                        </Link>

                        {/* Activer/Desactiver */}
                        <button
                          onClick={() => handleToggle(product)}
                          disabled={togglingId === product.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {togglingId === product.id
                            ? "..."
                            : product.isActive
                              ? "Desactiver"
                              : "Activer"}
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === product.id ? "Suppression..." : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
