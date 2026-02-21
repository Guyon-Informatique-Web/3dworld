"use client";

// Formulaire d'inscription — création de compte via Supabase Auth + sync Prisma
// Affiche un message de vérification email si le confirm est activé

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  /** Soumet le formulaire d'inscription */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validation côté client
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Création du compte via Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) {
        const message = traduireErreur(authError.message);
        setError(message);
        setLoading(false);
        return;
      }

      // Si l'email de confirmation est requis (identities vide = email déjà utilisé ou confirm requis)
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        setError("Un compte existe déjà avec cette adresse email.");
        setLoading(false);
        return;
      }

      // Si auto-confirm est désactivé, afficher le message de vérification
      if (data.user && !data.session) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

      // Si auto-confirm est activé, synchroniser Prisma et rediriger
      if (data.session) {
        const syncResponse = await fetch("/api/auth/sync-user", {
          method: "POST",
        });

        if (!syncResponse.ok) {
          setError("Erreur lors de la création du profil. Veuillez réessayer.");
          setLoading(false);
          return;
        }

        router.push("/mon-compte");
        router.refresh();
      }
    } catch {
      setError("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  // Écran de confirmation d'email
  if (emailSent) {
    return (
      <div className="rounded-2xl border border-primary-light/30 bg-white p-8 shadow-lg">
        <div className="text-center">
          {/* Icône email */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-alt">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-text">Vérifiez votre email</h2>
          <p className="mt-3 text-sm text-text-light">
            Un email de confirmation a été envoyé à{" "}
            <span className="font-medium text-text">{email}</span>.
            Cliquez sur le lien dans l&apos;email pour activer votre compte.
          </p>

          <Link
            href="/connexion"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-light/30 bg-white p-8 shadow-lg">
      {/* En-tête */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text">Créer un compte</h1>
        <p className="mt-2 text-sm text-text-light">
          Rejoignez 3D World pour vos impressions 3D
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
        {/* Nom */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-text">
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Jean Dupont"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

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
            autoComplete="new-password"
            placeholder="6 caractères minimum"
            minLength={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-text"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Retapez votre mot de passe"
            minLength={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Bouton d'inscription */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Création en cours..." : "Créer mon compte"}
        </button>
      </form>

      {/* Lien connexion */}
      <p className="mt-6 text-center text-sm text-text-light">
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="font-medium text-primary transition-colors hover:text-primary-dark"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

/**
 * Traduit les messages d'erreur Supabase Auth en français.
 */
function traduireErreur(message: string): string {
  if (message.includes("User already registered")) {
    return "Un compte existe déjà avec cette adresse email.";
  }
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (message.includes("Unable to validate email")) {
    return "L'adresse email n'est pas valide.";
  }
  if (message.includes("Signup is disabled")) {
    return "Les inscriptions sont temporairement désactivées.";
  }
  if (message.includes("Too many requests")) {
    return "Trop de tentatives. Veuillez patienter quelques minutes.";
  }
  return "Erreur lors de l'inscription. Veuillez réessayer.";
}
