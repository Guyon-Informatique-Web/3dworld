// Helpers d'authentification — récupération utilisateur, vérification rôle, sync Prisma
// Utilisé côté serveur uniquement (Server Components, Route Handlers, Server Actions)

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Récupère l'utilisateur connecté (session Supabase + données Prisma).
 * Retourne null si aucune session active ou si l'utilisateur Prisma n'existe pas.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) return null;

  const user = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  return user;
}

/**
 * Vérifie que l'utilisateur est connecté.
 * Redirige vers /connexion si non connecté.
 * Retourne l'utilisateur Prisma sinon.
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/connexion");
  }

  return user;
}

/**
 * Vérifie que l'utilisateur est connecté ET a le rôle ADMIN.
 * Redirige vers /connexion si non connecté, vers / si pas admin.
 * Retourne l'utilisateur Prisma sinon.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/connexion");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}

/**
 * Crée l'entrée User Prisma si elle n'existe pas encore.
 * Appelé après la première connexion/inscription pour synchroniser Supabase et Prisma.
 * Retourne l'utilisateur Prisma existant ou nouvellement créé.
 */
export async function createUserIfNotExists(
  supabaseUser: SupabaseUser
): Promise<User> {
  // Vérifier si l'utilisateur existe déjà en base
  const existingUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  if (existingUser) return existingUser;

  // Créer l'entrée avec le rôle CLIENT par défaut
  const newUser = await prisma.user.create({
    data: {
      email: supabaseUser.email ?? "",
      name: supabaseUser.user_metadata?.name ?? null,
      supabaseId: supabaseUser.id,
    },
  });

  return newUser;
}
