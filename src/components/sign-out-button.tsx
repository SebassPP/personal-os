"use client";

import { useFormStatus } from "react-dom";
import { LogOutIcon } from "lucide-react";

import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

/** Debe vivir dentro del `<form>` para que `useFormStatus` lea su estado. */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      className="w-full justify-start text-muted-foreground"
    >
      <LogOutIcon aria-hidden />
      {pending ? "Saliendo…" : "Cerrar sesión"}
    </Button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <SubmitButton />
    </form>
  );
}
