"use client";

import { FormEvent, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

/** États possibles du formulaire */
type FormStatus = "idle" | "loading" | "success" | "error";

/**
 * Clé d'accès Web3Forms (clé publique, conçue pour être côté frontend).
 * Remplacer cette valeur par votre vraie clé obtenue sur https://web3forms.com
 */
const WEB3FORMS_ACCESS_KEY = "VOTRE_CLE_WEB3FORMS";

/** Options pour le type de projet */
const PROJECT_TYPES = [
  "Impression sur commande",
  "Achat d'une création",
  "Projet personnalisé",
  "Autre",
] as const;

/** Options pour le budget estimé */
const BUDGET_OPTIONS = [
  "Moins de 50 \u20ac",
  "50 \u20ac - 100 \u20ac",
  "100 \u20ac - 300 \u20ac",
  "Plus de 300 \u20ac",
  "Je ne sais pas encore",
] as const;

/**
 * Formulaire de demande de devis.
 * Envoi via Web3Forms, avec gestion des états idle / loading / success / error.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  /** Gestion de la soumission du formulaire */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "Nouvelle demande de devis - 3D World");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json() as { success: boolean };

      if (data.success) {
        setStatus("success");
        // Réinitialiser le formulaire après succès
        (event.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatedSection>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Votre nom"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-text transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="votre@email.com"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-text transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="06 12 34 56 78"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-text transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Type de projet */}
        <div>
          <label
            htmlFor="project_type"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Type de projet <span className="text-red-500">*</span>
          </label>
          <select
            id="project_type"
            name="project_type"
            required
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-text transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          >
            <option value="" disabled>
              Sélectionnez un type de projet
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Description du projet */}
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Description du projet <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Décrivez votre projet, vos besoins, vos contraintes..."
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-text transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Budget estimé */}
        <div>
          <label
            htmlFor="budget"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Budget estimé
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-text transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          >
            <option value="">Sélectionnez un budget (optionnel)</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Message de succès */}
        {status === "success" && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Votre demande a bien été envoyée ! Nous vous répondrons dans les
            plus brefs délais.
          </div>
        )}

        {/* Message d'erreur */}
        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Une erreur est survenue. Veuillez réessayer ou nous contacter
            directement par email.
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-dark focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              {/* Spinner */}
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Envoi en cours...
            </>
          ) : (
            "Envoyer ma demande"
          )}
        </button>
      </form>
    </AnimatedSection>
  );
}
