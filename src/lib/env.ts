/**
 * Lectura y validación de las variables de entorno públicas.
 *
 * Se validan al importar el módulo para fallar en el arranque (o en el build)
 * en lugar de fallar más tarde con un error opaco de Supabase.
 *
 * Nota: en Next.js las variables `NEXT_PUBLIC_*` se sustituyen en tiempo de
 * build, por eso hay que leerlas como acceso literal a `process.env.X` y no
 * desestructurando `process.env`.
 */

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example a .env.local y completa los valores del proyecto de Supabase.`,
    );
  }

  return value;
}

export const SUPABASE_URL = requireEnv(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const SUPABASE_ANON_KEY = requireEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
