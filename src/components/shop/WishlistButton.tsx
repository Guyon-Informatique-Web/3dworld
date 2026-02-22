"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist?: boolean;
}

export default function WishlistButton({
  productId,
  initialInWishlist = false,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      if (inWishlist) {
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (response.status === 401) {
          router.push("/connexion");
          return;
        }

        if (response.ok) {
          setInWishlist(false);
        }
      } else {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (response.status === 401) {
          router.push("/connexion");
          return;
        }

        if (response.ok || response.status === 409) {
          setInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Wishlist action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      whileTap={{ scale: 0.85 }}
      className="inline-flex items-center justify-center rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-50"
      aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={inWishlist ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-400"}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.button>
  );
}
