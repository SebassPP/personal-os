import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

type SessionCheck = {
  /** Respuesta que ya lleva las cookies refrescadas de Supabase. */
  response: NextResponse;
  /** `true` si la petición trae una sesión válida. */
  isAuthenticated: boolean;
};

/**
 * Refresca el token de Supabase y averigua si la petición está autenticada.
 *
 * Solo se llama desde `src/proxy.ts`. El proxy es el único punto donde se puede
 * escribir la cookie renovada en la respuesta, por eso debe ejecutarse en todas
 * las rutas de la app.
 */
export async function updateSession(
  request: NextRequest,
): Promise<SessionCheck> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        // Se recrea la respuesta para que el render posterior vea las cookies
        // ya actualizadas en la petición.
        response = NextResponse.next({ request });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }

        // Cabeceras anti-caché que exige Supabase al escribir cookies de auth:
        // sin ellas un CDN podría servir la sesión de un usuario a otro.
        for (const [key, headerValue] of Object.entries(headers)) {
          response.headers.set(key, headerValue);
        }
      },
    },
  });

  // `getClaims` valida el JWT (en local si el proyecto usa claves asimétricas)
  // y refresca la sesión si está a punto de expirar.
  const { data } = await supabase.auth.getClaims();

  return { response, isAuthenticated: Boolean(data?.claims) };
}
