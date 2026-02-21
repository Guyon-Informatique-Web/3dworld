// Layout admin — vérifie le rôle ADMIN, affiche la sidebar et le header admin
// Remplace complètement le Header/Footer du site vitrine

import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Administration",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Vérifie que l'utilisateur est connecté et a le rôle ADMIN
  // Redirige vers /connexion ou / si non autorisé
  const user = await requireAdmin();

  // Nom à afficher dans le header (nom ou email)
  const adminName = user.name ?? user.email;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar fixe à gauche */}
      <AdminSidebar />

      {/* Contenu principal décalé de la largeur de la sidebar */}
      <div className="ml-[250px]">
        {/* Header admin */}
        <AdminHeader adminName={adminName} />

        {/* Contenu de la page */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
