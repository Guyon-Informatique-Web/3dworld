// Client Supabase côté navigateur (composants client "use client")
// Utilise createBrowserClient de @supabase/ssr pour la gestion automatique des cookies

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
