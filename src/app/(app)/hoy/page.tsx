import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoy",
};

export default function HoyPage() {
  return (
    <div className="grid gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">Panel del día</h1>
      <p className="text-sm text-muted-foreground">
        Aquí irá el resumen de hoy.
      </p>
    </div>
  );
}
