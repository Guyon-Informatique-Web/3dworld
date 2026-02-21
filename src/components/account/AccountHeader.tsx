// En-tete de l'espace client — affiche les infos utilisateur et bouton deconnexion
// Composant serveur utilise dans le layout de mon-compte

import type { User } from "@/generated/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AccountHeaderProps {
  /** Utilisateur connecte (provient de requireAuth) */
  user: User;
}

/**
 * Header de l'espace Mon compte.
 * Affiche le nom, l'email de l'utilisateur et un formulaire de deconnexion.
 */
export default function AccountHeader({ user }: AccountHeaderProps) {
  /** Server Action — deconnexion via Supabase puis redirection */
  async function handleSignOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Infos utilisateur */}
      <div>
        <h1 className="text-2xl font-bold text-text">Mon compte</h1>
        <p className="mt-1 text-sm text-text-light">
          {user.name ? (
            <>
              <span className="font-medium text-text">{user.name}</span>
              {" — "}
            </>
          ) : null}
          {user.email}
        </p>
      </div>

      {/* Bouton deconnexion */}
      <form action={handleSignOut}>
        <button
          type="submit"
          className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-light transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Deconnexion
        </button>
      </form>
    </div>
  );
}
