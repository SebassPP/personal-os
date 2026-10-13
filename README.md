# personal-os

Panel personal de un solo usuario. Next.js 16 (App Router) + Tailwind v4 +
shadcn/ui, con Supabase para base de datos y autenticación.

Las convenciones del proyecto (Server Actions, RLS, migraciones, nombres)
están en [CLAUDE.md](CLAUDE.md).

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # y completa los valores del proyecto de Supabase
pnpm dev
```

Variables necesarias en `.env.local` (Supabase → Project Settings → API):

| Variable | Dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave `anon` / `public` |

No hay pantalla de registro. Crea tu usuario desde el panel de Supabase
(Authentication → Users → Add user) y entra en `/login`.

## Base de datos

El esquema se versiona con el CLI de Supabase en `supabase/migrations/`:

```bash
pnpm supabase login
pnpm supabase link --project-ref <tu-project-ref>

pnpm db:new nombre_del_cambio   # nueva migración
pnpm db:push                    # aplicar migraciones pendientes
pnpm db:types                   # regenerar tipos de TypeScript
```

Toda tabla nueva debe activar RLS y definir sus policies en la misma migración.

## Comandos

```bash
pnpm dev         # servidor de desarrollo
pnpm build       # build de producción
pnpm lint        # ESLint
pnpm typecheck   # tipos de rutas + tsc --noEmit
```
