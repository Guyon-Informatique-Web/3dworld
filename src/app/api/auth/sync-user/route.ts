// Endpoint de synchronisation utilisateur Prisma — POST /api/auth/sync-user
// Appelé après login/register côté client pour créer/récupérer l'entrée User Prisma
// Nécessaire car les client components ne peuvent pas appeler Prisma directement

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createUserIfNotExists } from "@/lib/auth";

export async function POST() {
  try {
    // Récupérer l'utilisateur Supabase depuis la session
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !supabaseUser) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Créer ou récupérer l'utilisateur Prisma
    const user = await createUserIfNotExists(supabaseUser);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Erreur sync-user:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
