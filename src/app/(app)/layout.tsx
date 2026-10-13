import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser } from "@/lib/auth/session";
import { LOGIN_ROUTE } from "@/lib/routes";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  // `src/proxy.ts` ya redirige, pero se vuelve a comprobar aquí: el proxy es una
  // comprobación optimista y no debe ser la única barrera.
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN_ROUTE);
  }

  return (
    <div className="flex min-h-svh">
      <AppSidebar userEmail={user.email ?? "Sesión activa"} />
      <main className="min-w-0 flex-1 px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
