import { createBrowserClient } from "@supabase/ssr";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Cliente de Supabase para componentes de navegador (`"use client"`).
 *
 * Úsalo solo para lecturas reactivas y suscripciones realtime. Las mutaciones
 * van por Server Actions, que son las que escriben cookies y revalidan caché.
 *
 * `createBrowserClient` devuelve un singleton, así que se puede llamar en el
 * cuerpo del componente sin memorizar el resultado.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
