import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_AUTHENTICATED_ROUTE,
  LOGIN_ROUTE,
  isPublicRoute,
} from "@/lib/routes";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Guardia de autenticación de toda la app.
 *
 * En Next.js 16 el antiguo `middleware.ts` se llama `proxy.ts`; el
 * comportamiento es el mismo.
 *
 * Esto es una comprobación optimista para redirigir pronto, no la barrera de
 * seguridad. La autorización real la imponen RLS en Supabase y la lectura de
 * sesión en cada Server Component o Server Action.
 */
export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isPublic = isPublicRoute(pathname);

  if (!isAuthenticated && !isPublic) {
    return redirectTo(LOGIN_ROUTE, request, response);
  }

  if (isAuthenticated && isPublic) {
    return redirectTo(DEFAULT_AUTHENTICATED_ROUTE, request, response);
  }

  return response;
}

/**
 * Redirige conservando las cookies que `updateSession` acaba de refrescar.
 * Sin este traspaso se perdería el token renovado y la sesión se caería.
 */
function redirectTo(
  pathname: string,
  request: NextRequest,
  sessionResponse: NextResponse,
): NextResponse {
  const redirectResponse = NextResponse.redirect(
    new URL(pathname, request.url),
  );

  for (const cookie of sessionResponse.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  return redirectResponse;
}

export const config = {
  /**
   * Se ejecuta en todas las rutas menos los assets estáticos de Next, el
   * favicon y los archivos con extensión servidos desde /public.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
