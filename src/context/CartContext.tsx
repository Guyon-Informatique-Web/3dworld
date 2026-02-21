// Context React pour le panier — gere l'etat global du panier avec persistance localStorage
// Utilise des fonctions pures de cart.ts pour les operations sur les articles

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type CartItem,
  CART_STORAGE_KEY,
  addItem as addCartItem,
  removeItem as removeCartItem,
  updateQuantity as updateCartQuantity,
  clearCart as clearCartItems,
  getSubtotal,
  getTotalItems,
} from "@/lib/cart";

/** Valeurs exposees par le contexte du panier */
interface CartContextValue {
  /** Articles actuellement dans le panier */
  items: CartItem[];
  /** Ajouter un article au panier */
  addItem: (item: CartItem) => void;
  /** Supprimer un article par productId + variantId */
  removeItem: (productId: string, variantId?: string) => void;
  /** Mettre a jour la quantite d'un article */
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  /** Vider tout le panier */
  clearCart: () => void;
  /** Nombre total d'articles dans le panier */
  totalItems: number;
  /** Sous-total en euros */
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Provider du panier — wrappe les enfants pour leur donner acces au panier.
 * Initialise le panier vide pour eviter les erreurs d'hydration SSR,
 * puis synchronise depuis le localStorage dans un useEffect.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger le panier depuis le localStorage au montage (cote client uniquement)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // En cas d'erreur de parsing, on repart a zero
      console.warn("[Panier] Erreur de lecture du localStorage, reinitialisation.");
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setIsInitialized(true);
  }, []);

  // Persister dans le localStorage a chaque modification (apres initialisation)
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.warn("[Panier] Erreur d'ecriture dans le localStorage.");
    }
  }, [items, isInitialized]);

  /** Ajouter un article */
  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => addCartItem(prev, item));
  }, []);

  /** Supprimer un article */
  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((prev) => removeCartItem(prev, productId, variantId));
  }, []);

  /** Mettre a jour la quantite */
  const updateQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      setItems((prev) => updateCartQuantity(prev, productId, variantId, quantity));
    },
    []
  );

  /** Vider le panier */
  const clearCart = useCallback(() => {
    setItems(clearCartItems());
  }, []);

  const totalItems = getTotalItems(items);
  const subtotal = getSubtotal(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook pour acceder au contexte du panier.
 * Doit etre utilise a l'interieur d'un CartProvider.
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart() doit etre utilise a l'interieur d'un <CartProvider>");
  }
  return context;
}
