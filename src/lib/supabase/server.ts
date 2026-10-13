import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Cliente de Supabase para todo el lado servidor: Server Components,
 * Server Actions y Route Handlers.
 *
 * Los tres contextos leen y escriben la sesión a través del mismo almacén de
 * cookies de `next/headers`, así que comparten fábrica. La única diferencia es
 * que los Server Components no pueden escribir cookies; ese caso se absorbe en
 * el `catch` de `setAll` y el refresco de token lo resuelve `src/proxy.ts`.
 *
 * IMPORTANTE: hay que crear un cliente nuevo por petición. Nunca guardar el
 * resultado en una variable de módulo ni compartirlo entre peticiones.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Los Server Components no pueden escribir cookies. Se ignora a
          // propósito: `src/proxy.ts` refresca la sesión en cada petición.
        }
      },
    },
  });
}
