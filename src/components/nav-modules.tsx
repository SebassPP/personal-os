"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import { NAV_MODULES } from "@/lib/navigation";

const ITEM_BASE_CLASSES =
  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors";

export function NavModules() {
  const pathname = usePathname();

  return (
    <nav aria-label="Módulos" className="grid gap-0.5">
      {NAV_MODULES.map(({ label, href, icon: Icon, isEnabled }) => {
        if (!isEnabled) {
          return (
            <span
              key={href}
              aria-disabled="true"
              className={cn(
                ITEM_BASE_CLASSES,
                "cursor-not-allowed text-muted-foreground/60",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
              <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                Pronto
              </span>
            </span>
          );
        }

        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              ITEM_BASE_CLASSES,
              isActive
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
