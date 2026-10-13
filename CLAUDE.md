@AGENTS.md

# personal-os

Panel personal de **un solo usuario**. No hay multi-tenant, no hay registro
público, no hay roles. Una única cuenta creada a mano desde el panel de
Supabase entra y usa todos los módulos.

La app se organiza por módulos independientes: **Hoy**, **Trabajo**,
**Aprendizaje**, **Hábitos** y **Finanzas**. Ahora mismo solo Hoy y Trabajo
están activos; el resto aparece en la barra lateral marcado como "pronto".

## Stack

| Pieza | Elección |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui (base Radix, preset `nova`, color base `neutral`) |
| Base de datos y auth | Supabase |
| Acceso a datos | `@supabase/ssr` — **sin Prisma y sin ningún otro ORM** |
| Migraciones | Supabase CLI, SQL versionado en `supabase/migrations/` |
| Gestor de paquetes | pnpm |
| Tema | Modo oscuro fijo (clase `dark` en `<html>`) |

## Convenciones

### Mutaciones: Server Actions

Toda escritura va por **Server Actions**. Son las que pueden escribir cookies,
revalidar caché y redirigir.

Los **Route Handlers** (`route.ts`) se reservan **solo para webhooks** y
callbacks de terceros que necesitan una URL pública. No se crean Route
Handlers para que el propio frontend haga fetch: eso es una Server Action.

### Seguridad de datos: RLS obligatoria

**Toda tabla debe tener Row Level Security activada**, sin excepciones. La
clave `anon` viaja al navegador, así que RLS es la única barrera real entre los
datos y cualquiera que abra las devtools.

Cada migración que crea una tabla debe, en el mismo archivo:

1. `alter table ... enable row level security;`
2. Definir las policies de `select`, `insert`, `update` y `delete`.

Al ser un panel de un solo usuario, el patrón por defecto es acotar por
`auth.uid()` contra una columna `user_id`.

Nunca se usa la `service_role` key en la app. Si alguna vez hace falta, va solo
en un contexto de servidor aislado y jamás en una variable `NEXT_PUBLIC_*`.

### Migraciones SQL versionadas

Los cambios de esquema se hacen siempre con un archivo de migración, nunca a
mano desde el panel de Supabase.

```bash
pnpm db:new nombre_del_cambio   # crea supabase/migrations/<timestamp>_nombre.sql
pnpm db:push                    # aplica las migraciones pendientes
pnpm db:types                   # regenera los tipos de TypeScript
```

Las migraciones son inmutables una vez aplicadas: para corregir algo se crea
una migración nueva.

### Componentes: shadcn/ui

La UI se construye con componentes de shadcn/ui. Antes de escribir un
componente a mano, se comprueba si existe en el registro:

```bash
pnpm dlx shadcn@latest add <componente>
```

Los archivos de `src/components/ui/` son código propio del proyecto y se pueden
editar, pero conviene mantenerlos cerca del original para que las
actualizaciones del registro no duelan.

### Nombres

- **Base de datos**: inglés y `snake_case` (`daily_entries`, `created_at`,
  `user_id`). Aplica a tablas, columnas, índices, funciones y policies.
- **Interfaz**: **todo el texto visible va en español** (etiquetas, títulos,
  mensajes de error, estados vacíos, botones).

Esa frontera es deliberada: el esquema queda en inglés porque es el idioma de
SQL y de las herramientas; lo que lee la persona está en español.

- Componentes y tipos: `PascalCase`.
- Archivos de componente: `kebab-case.tsx`.
- Variables y funciones: `camelCase`; booleanos con prefijo `is`/`has`/`should`.
- Constantes de módulo: `UPPER_SNAKE_CASE`.

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/              # rutas públicas: sin barra lateral
│   │   └── login/
│   │       ├── page.tsx
│   │       └── login-form.tsx
│   ├── (app)/               # rutas autenticadas: layout con barra lateral
│   │   ├── layout.tsx       # comprueba sesión + monta AppSidebar
│   │   ├── hoy/
│   │   └── trabajo/
│   ├── layout.tsx           # layout raíz: fuentes, modo oscuro, metadata
│   ├── globals.css          # Tailwind + tokens de shadcn
│   └── page.tsx             # / redirige a /hoy
├── components/
│   ├── ui/                  # componentes generados por shadcn
│   └── *.tsx                # componentes propios de la app
├── lib/
│   ├── supabase/            # clientes de Supabase (uno por contexto)
│   ├── auth/                # acciones de sesión y lectura del usuario
│   ├── env.ts               # validación de variables de entorno
│   ├── navigation.ts        # módulos de la barra lateral
│   └── routes.ts            # rutas públicas y destinos de redirección
└── proxy.ts                 # guardia de autenticación de toda la app
supabase/
├── config.toml
└── migrations/              # SQL versionado
```

Módulo nuevo = carpeta nueva en `src/app/(app)/<modulo>/`, más su entrada en
`src/lib/navigation.ts` con `isEnabled: true`.

## Clientes de Supabase

Hay uno por contexto de ejecución y **nunca se comparten entre peticiones**:

| Archivo | Para qué |
|---|---|
| `src/lib/supabase/server.ts` | Server Components, Server Actions y Route Handlers |
| `src/lib/supabase/client.ts` | Componentes `"use client"` (lecturas y realtime) |
| `src/lib/supabase/proxy.ts` | Solo `src/proxy.ts`: refresca el token en cada petición |

Server Components y Route Handlers comparten fábrica porque ambos leen la
sesión del mismo almacén de cookies de `next/headers`. La diferencia es que un
Server Component no puede escribir cookies; ese caso se absorbe en el `catch`
de `setAll` y el refresco lo resuelve el proxy.

## Autenticación

- `src/proxy.ts` protege todo salvo `/login` y los assets estáticos.
  En Next.js 16 el antiguo `middleware.ts` se llama `proxy.ts`.
- El proxy es una **comprobación optimista** para redirigir pronto, no la
  barrera de seguridad. La autorización real son las policies de RLS más la
  lectura de sesión en cada Server Component y Server Action.
- `src/app/(app)/layout.tsx` vuelve a comprobar la sesión antes de renderizar.
- No hay pantalla de registro ni de recuperación de contraseña. Las cuentas se
  gestionan desde el panel de Supabase.

## Variables de entorno

Viven en `.env.local` (ignorado por git). `.env.example` documenta las claves
sin valores reales.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

`src/lib/env.ts` las valida al importarse, así que si falta alguna el fallo
aparece en el arranque con un mensaje claro y no más tarde con un error opaco
de Supabase.

## Comandos

```bash
pnpm dev         # servidor de desarrollo
pnpm build       # build de producción
pnpm lint        # ESLint
pnpm typecheck   # tsc --noEmit
```

Antes de dar por terminado un cambio: `pnpm lint` y `pnpm build` en verde.
