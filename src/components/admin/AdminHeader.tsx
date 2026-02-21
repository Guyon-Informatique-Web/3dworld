// Header admin — affiche le nom de l'admin, bouton retour au site et déconnexion
// Server component qui reçoit les infos utilisateur depuis le layout admin

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface AdminHeaderProps {
  /** Nom ou email de l'administrateur connecté */
  adminName: string;
}

/**
 * Header admin avec informations utilisateur et actions rapides.
 * Fond blanc, bordure basse, padding horizontal.
 */
export default function AdminHeader({ adminName }: AdminHeaderProps) {
  // Server action de déconnexion
  async function handleLogout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/connexion");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Titre de la section (vide ou dynamique selon la page) */}
      <div />

      {/* Actions à droite */}
      <div className="flex items-center gap-4">
        {/* Nom de l'admin */}
        <span className="text-sm text-text-light">
          {adminName}
        </span>

        {/* Retour au site */}
        <Link
          href="/"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-text-light transition-colors hover:border-primary hover:text-primary"
        >
          Retour au site
        </Link>

        {/* Déconnexion */}
        <form action={handleLogout}>
          <button
            type="submit"
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-text-light transition-colors hover:bg-red-50 hover:text-red-600"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
