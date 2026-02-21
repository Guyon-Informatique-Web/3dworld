// Layout de l'espace client (Mon compte)
// Server Component — verifie l'authentification et affiche le header du compte

import { requireAuth } from "@/lib/auth";
import AccountHeader from "@/components/account/AccountHeader";

/**
 * Layout protege par authentification.
 * Redirige vers /connexion si l'utilisateur n'est pas connecte.
 * Affiche l'en-tete du compte avec les infos utilisateur.
 */
export default async function MonCompteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Carte blanche principale */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <AccountHeader user={user} />

        {/* Séparateur */}
        <hr className="my-6 border-gray-100" />

        {/* Contenu de la page enfant */}
        {children}
      </div>
    </div>
  );
}
