"use client";

// Formulaire de connexion — email/mot de passe via Supabase Auth
// Après connexion, synchronise l'utilisateur Prisma puis redirige selon le rôle

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Soumet le formulaire de connexion */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Connexion via Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Traduire les erreurs courantes en français
        const message = traduireErreur(authError.message);
        setError(message);
        setLoading(false);
        return;
      }

      // Synchroniser l'utilisateur Prisma (créer s'il n'existe pas)
      const syncResponse = await fetch("/api/auth/sync-user", {
        method: "POST",
      });

      if (!syncResponse.ok) {
        setError("Erreur lors de la synchronisation du compte. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      const { role } = await syncResponse.json();

      // Redirection selon le rôle
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/mon-compte");
      }

      router.refresh();
    } catch {
      setError("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary-light/30 bg-white p-8 shadow-lg">
      {/* En-tête */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text">Connexion</h1>
        <p className="mt-2 text-sm text-text-light">
          Accédez à votre espace personnel
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="votre@email.fr"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-text">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      {/* Lien inscription */}
      <p className="mt-6 text-center text-sm text-text-light">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-medium text-primary transition-colors hover:text-primary-dark"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

/**
 * Traduit les messages d'erreur Supabase Auth en français.
 */
function traduireErreur(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (message.includes("Email not confirmed")) {
    return "Votre email n'a pas encore été confirmé. Vérifiez votre boîte de réception.";
  }
  if (message.includes("Too many requests")) {
    return "Trop de tentatives. Veuillez patienter quelques minutes.";
  }
  if (message.includes("User not found")) {
    return "Aucun compte trouvé avec cette adresse email.";
  }
  return "Erreur de connexion. Veuillez vérifier vos identifiants.";
}
