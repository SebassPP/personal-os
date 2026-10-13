import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trabajo",
};

export default function TrabajoPage() {
  return (
    <div className="grid gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">Trabajo</h1>
      <p className="text-sm text-muted-foreground">
        Aquí irá el seguimiento de proyectos y tareas.
      </p>
    </div>
  );
}
