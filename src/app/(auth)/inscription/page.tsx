// Page d'inscription — formulaire de création de compte client
// Server component avec metadata, le formulaire est un client component séparé

import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Créez votre compte 3D World pour commander vos impressions 3D et suivre vos commandes.",
};

export default function InscriptionPage() {
  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </section>
  );
}
