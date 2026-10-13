"use server";

import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_ROUTE, LOGIN_ROUTE } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string | null;
};

/**
 * Inicia sesión con correo y contraseña.
 *
 * El panel es de un solo usuario: no hay registro. Las cuentas se crean a mano
 * desde el panel de Supabase.
 */
export async function signIn(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Escribe tu correo y tu contraseña." };
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Mensaje genérico a propósito: no revelamos si el correo existe.
      return { error: "No pudimos iniciar sesión. Revisa tus datos." };
    }
  } catch (cause) {
    console.error("[auth] signInWithPassword falló", cause);
    return { error: "No pudimos contactar con el servidor. Inténtalo de nuevo." };
  }

  // `redirect` funciona lanzando una excepción interna, por eso va fuera del
  // try/catch: dentro quedaría atrapado y la redirección no ocurriría.
  redirect(DEFAULT_AUTHENTICATED_ROUTE);
}

/** Cierra la sesión y devuelve al login. */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();

  try {
    await supabase.auth.signOut();
  } catch (cause) {
    // Aunque falle el borrado remoto, seguimos al login: las cookies locales
    // ya quedaron invalidadas y el proxy bloqueará el acceso.
    console.error("[auth] signOut falló", cause);
  }

  redirect(LOGIN_ROUTE);
}
