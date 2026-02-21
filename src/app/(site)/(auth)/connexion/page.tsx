// Page de connexion — formulaire email/mot de passe avec Supabase Auth
// Server component avec metadata, le formulaire est un client component séparé

import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre compte 3D World pour suivre vos commandes et accéder à votre espace personnel.",
};

export default function ConnexionPage() {
  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </section>
  );
}
