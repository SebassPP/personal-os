import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes";

/** La raíz no tiene contenido propio: entra directo al panel del día. */
export default function RootPage() {
  redirect(DEFAULT_AUTHENTICATED_ROUTE);
}
