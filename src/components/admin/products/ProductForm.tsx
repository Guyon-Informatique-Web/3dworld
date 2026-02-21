// Formulaire de création/édition d'un produit
// Gère le nom, la description, le prix, la catégorie, les images et le flag variantes

"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/admin/produits/actions";
import ImageUpload from "./ImageUpload";

/** Données d'un produit existant (mode édition) */
interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  images: string[];
  hasVariants: boolean;
}

/** Catégorie disponible pour le select */
interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  /** Produit à éditer (absent = mode création) */
  product?: ProductData;
  /** Liste des catégories disponibles */
  categories: CategoryOption[];
}

/** Type de retour des server actions */
interface ActionResult {
  success: boolean;
  error?: string;
}

/** État initial du formulaire */
const INITIAL_STATE: ActionResult = { success: false, error: undefined };

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  // État des images (géré séparément car composant client)
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  // État du flag variantes
  const [hasVariants, setHasVariants] = useState(product?.hasVariants ?? false);

  /** Wrapper pour les server actions (creation ou edition) */
  async function formAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    // Ajouter les images au FormData (serialisees en JSON)
    formData.set("images", JSON.stringify(images));
    // Ajouter le flag variantes
    formData.set("hasVariants", hasVariants ? "true" : "false");

    if (isEditing) {
      return updateProduct(product.id, formData);
    }
    return createProduct(formData);
  }

  const [state, dispatch, isPending] = useActionState(formAction, INITIAL_STATE);

  // Rediriger vers la liste après un succès
  useEffect(() => {
    if (state.success) {
      router.push("/admin/produits");
    }
  }, [state.success, router]);

  /** Callback stable pour ImageUpload */
  const handleImagesChange = useCallback((urls: string[]) => {
    setImages(urls);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Titre du formulaire */}
        <h2 className="mb-6 text-xl font-semibold text-text">
          {isEditing ? "Modifier le produit" : "Nouveau produit"}
        </h2>

        <form action={dispatch} className="space-y-6">
          {/* Champ nom (obligatoire) */}
          <div>
            <label htmlFor="product-name" className="mb-1 block text-sm font-medium text-text">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              required
              defaultValue={product?.name ?? ""}
              placeholder="Ex : Dragon articulé, Support téléphone..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Champ description (obligatoire) */}
          <div>
            <label htmlFor="product-description" className="mb-1 block text-sm font-medium text-text">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              required
              defaultValue={product?.description ?? ""}
              placeholder="Description détaillée du produit..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Ligne prix + categorie */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Champ prix (obligatoire) */}
            <div>
              <label htmlFor="product-price" className="mb-1 block text-sm font-medium text-text">
                Prix (EUR) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                defaultValue={product?.price ?? ""}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Selection de categorie (obligatoire) */}
            <div>
              <label htmlFor="product-category" className="mb-1 block text-sm font-medium text-text">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category"
                name="categoryId"
                required
                defaultValue={product?.categoryId ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload d'images */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              Images
            </label>
            <ImageUpload images={images} onChange={handleImagesChange} />
          </div>

          {/* Toggle variantes */}
          <div className="flex items-center gap-3">
            <input
              id="product-variants"
              type="checkbox"
              checked={hasVariants}
              onChange={(e) => setHasVariants(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="product-variants" className="text-sm font-medium text-text">
              Ce produit a des variantes (taille, couleur, etc.)
            </label>
          </div>

          {/* Message d'erreur */}
          {state.error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/produits")}
              disabled={isPending}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-text-light transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
