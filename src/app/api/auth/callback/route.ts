// Route de callback OAuth/email — gère le retour après confirmation email Supabase
// Échange le code d'authentification contre une session, sync Prisma, puis redirige

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createUserIfNotExists } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    // Créer le client Supabase compatible Route Handler
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Échanger le code contre une session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Synchroniser l'utilisateur Prisma (créer s'il n'existe pas)
      const user = await createUserIfNotExists(data.user);

      // Rediriger selon le rôle
      const redirectPath = user.role === "ADMIN" ? "/admin" : next;
      const redirectUrl = new URL(redirectPath, origin);

      // Créer la réponse de redirection en copiant les cookies
      const redirectResponse = NextResponse.redirect(redirectUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });

      return redirectResponse;
    }
  }

  // En cas d'erreur, rediriger vers la page de connexion
  const errorUrl = new URL("/connexion", request.nextUrl.origin);
  return NextResponse.redirect(errorUrl);
}
