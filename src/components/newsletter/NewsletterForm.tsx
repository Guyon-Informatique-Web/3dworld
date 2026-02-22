// Formulaire d'inscription à la newsletter — client side
// Champ email + bouton d'inscription, états loading/success/error

"use client";

import { FormEvent, useState } from "react";

interface FormState {
  email: string;
  isLoading: boolean;
  message: string | null;
  messageType: "success" | "error" | null;
}

export default function NewsletterForm() {
  const [state, setState] = useState<FormState>({
    email: "",
    isLoading: false,
    message: null,
    messageType: null,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!state.email.trim()) {
      setState((prev) => ({
        ...prev,
        message: "Veuillez entrer un email.",
        messageType: "error",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, message: null }));

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email }),
      });

      const data = await response.json();

      if (data.success) {
        setState({
          email: "",
          isLoading: false,
          message: data.message,
          messageType: "success",
        });

        // Masquer le message après 5 secondes
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            message: null,
            messageType: null,
          }));
        }, 5000);
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          message: data.message || "Erreur lors de l'inscription.",
          messageType: "error",
        }));
      }
    } catch (error) {
      console.error("Erreur:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message: "Erreur lors de l'inscription.",
        messageType: "error",
      }));
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="Votre email"
          value={state.email}
          onChange={(e) =>
            setState((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={state.isLoading}
          className="flex-1 rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state.isLoading}
          className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {state.isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      {/* Message de succès ou d'erreur */}
      {state.message && (
        <p
          className={`text-sm font-medium ${
            state.messageType === "success"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
