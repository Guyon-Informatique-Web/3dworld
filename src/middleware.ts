// Middleware Next.js — protection des routes /admin/* et /mon-compte/*
// Vérifie la session Supabase via les cookies de la requête
// Utilise createServerClient de @supabase/ssr (compatible middleware, pas next/headers)

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Créer une réponse mutable pour pouvoir modifier les cookies
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Client Supabase compatible middleware (utilise request.cookies, pas next/headers)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Mettre à jour les cookies sur la requête (pour les Server Components en aval)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recréer la réponse avec la requête mise à jour
          supabaseResponse = NextResponse.next({
            request,
          });
          // Mettre à jour les cookies sur la réponse (pour le navigateur)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Rafraîchir la session (important pour éviter les sessions expirées)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protection des routes protégées : rediriger vers /connexion si non connecté
  if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/mon-compte"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// Appliquer le middleware uniquement sur les routes protégées et auth
export const config = {
  matcher: ["/admin/:path*", "/mon-compte/:path*"],
};
