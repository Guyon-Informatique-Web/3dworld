// Bouton compte utilisateur pour le header — icône utilisateur SVG
// Affiche "Connexion" si non connecté, redirige vers /mon-compte ou /admin si connecté

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Bouton compte avec icône utilisateur.
 * Vérifie la session Supabase au montage pour adapter le lien.
 */
export default function AccountButton() {
  const [href, setHref] = useState("/connexion");
  const [label, setLabel] = useState("Se connecter");

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Vérifier le rôle via l'API sync-user
        try {
          const res = await fetch("/api/auth/sync-user", { method: "POST" });
          if (res.ok) {
            const { role } = await res.json();
            if (role === "ADMIN") {
              setHref("/admin");
              setLabel("Administration");
            } else {
              setHref("/mon-compte");
              setLabel("Mon compte");
            }
          }
        } catch {
          // En cas d'erreur, rediriger vers mon-compte par défaut
          setHref("/mon-compte");
          setLabel("Mon compte");
        }
      }
    }

    checkSession();

    // Écouter les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        checkSession();
      } else if (event === "SIGNED_OUT") {
        setHref("/connexion");
        setLabel("Se connecter");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Link
      href={href}
      className="relative inline-flex items-center justify-center rounded-lg p-2 text-text-light transition-colors hover:text-primary"
      aria-label={label}
      title={label}
    >
      {/* Icône utilisateur SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </Link>
  );
}
