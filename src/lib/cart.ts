// Logique panier — fonctions pures pour manipuler les articles du panier
// Aucun effet de bord : chaque fonction retourne un nouveau tableau

/** Article dans le panier */
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
}

/** Cle de stockage dans le localStorage */
export const CART_STORAGE_KEY = "3dworld_cart";

/**
 * Ajoute un article au panier.
 * Si un article avec le meme productId + variantId existe deja,
 * on incremente sa quantite au lieu d'ajouter une ligne.
 */
export function addItem(items: CartItem[], newItem: CartItem): CartItem[] {
  const existingIndex = items.findIndex(
    (item) =>
      item.productId === newItem.productId &&
      item.variantId === newItem.variantId
  );

  if (existingIndex >= 0) {
    // Article deja present : incrementer la quantite
    return items.map((item, index) =>
      index === existingIndex
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  }

  // Nouvel article
  return [...items, { ...newItem }];
}

/**
 * Supprime un article du panier par productId + variantId.
 */
export function removeItem(
  items: CartItem[],
  productId: string,
  variantId?: string
): CartItem[] {
  return items.filter(
    (item) =>
      !(item.productId === productId && item.variantId === variantId)
  );
}

/**
 * Met a jour la quantite d'un article.
 * Si la quantite est <= 0, l'article est supprime.
 */
export function updateQuantity(
  items: CartItem[],
  productId: string,
  variantId: string | undefined,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeItem(items, productId, variantId);
  }

  return items.map((item) =>
    item.productId === productId && item.variantId === variantId
      ? { ...item, quantity }
      : item
  );
}

/**
 * Vide le panier — retourne un tableau vide.
 */
export function clearCart(): CartItem[] {
  return [];
}

/**
 * Calcule le sous-total du panier (somme des prix * quantites).
 */
export function getSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Calcule le nombre total d'articles dans le panier.
 */
export function getTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Formate un prix en euros avec le format francais.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
