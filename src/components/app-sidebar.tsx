import { NavModules } from "@/components/nav-modules";
import { SignOutButton } from "@/components/sign-out-button";
import { Separator } from "@/components/ui/separator";

type AppSidebarProps = {
  /** Correo de la sesión activa. */
  userEmail: string;
};

export function AppSidebar({ userEmail }: AppSidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-4 py-5">
        <p className="text-sm font-semibold tracking-tight">personal-os</p>
        <p className="truncate text-xs text-muted-foreground" title={userEmail}>
          {userEmail}
        </p>
      </div>

      <Separator />

      <div className="flex-1 overflow-y-auto p-2">
        <NavModules />
      </div>

      <Separator />

      <div className="p-2">
        <SignOutButton />
      </div>
    </aside>
  );
}
