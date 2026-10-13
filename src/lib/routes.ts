/** Ruta a la que se envía a quien no tiene sesión. */
export const LOGIN_ROUTE = "/login";

/** Ruta de entrada por defecto una vez hay sesión. */
export const DEFAULT_AUTHENTICATED_ROUTE = "/hoy";

/** Rutas accesibles sin sesión. Todo lo demás exige estar autenticado. */
export const PUBLIC_ROUTES: readonly string[] = [LOGIN_ROUTE];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
