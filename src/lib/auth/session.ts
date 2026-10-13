import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Usuario de la petición actual, o `null` si no hay sesión.
 *
 * Va envuelto en `cache` para que varios Server Components del mismo render
 * compartan una sola llamada a Supabase.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
});
