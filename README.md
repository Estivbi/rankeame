# Rankeame 🏆

**Votaciones en tiempo real sin registro** — crea un concurso de comida, comparte el enlace y vota con tus amigos al instante.

## ¿Qué es Rankeame?

Rankeame es una PWA (Progressive Web App) móvil-first que permite organizar concursos de comida en grupo sin que los participantes necesiten crear una cuenta. El organizador crea el concurso, comparte el enlace (o el PIN), y todos los invitados pueden votar de inmediato.

## Características

- 🍽️ **4 tipos de concurso predefinidos**: Tortillas, Croquetas, Comida por Color, Comida por Inicial
- 📊 **Clasificación en tiempo real** mediante Supabase Realtime
- 🔗 **Compartir por WhatsApp** con un clic (deep link, sin APIs externas)
- 🚫 **Sin registro** — los invitados votan directamente desde el enlace
- 📱 **Mobile-First** — diseñado para móvil, funciona como PWA instalable

## Tipos de Concurso

| Tipo | Criterios |
|------|-----------|
| 🍳 Tortillas | Sabor, Presentación, Jugosidad |
| 🍘 Croquetas | Sabor, Crujiente, Textura |
| 🌈 Comida por Color | Originalidad, Sabor, Presentación |
| 🔤 Comida por Inicial | Originalidad, Sabor, Presentación |

## Stack Tecnológico

- **Framework**: [Astro](https://astro.build/) (SSR) + [React](https://react.dev/) (islas interactivas)
- **Base de datos**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime) — plan gratuito
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Despliegue**: [Vercel](https://vercel.com/) (adaptador `@astrojs/vercel`)

## Despliegue en Vercel (configuración completa)

> La aplicación necesita una base de datos Supabase (plan gratuito). Sin ella, al intentar crear un concurso verás un error de configuración en lugar de "error de red".

### Paso 1 — Crea un proyecto Supabase (gratis)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita.
2. Pulsa **"New project"**, elige un nombre (p. ej. `rankeame`) y una contraseña para la base de datos, y selecciona la región más cercana.
3. Espera a que el proyecto se inicialice (~1 minuto).

### Paso 2 — Crea las tablas

1. En el panel de Supabase, abre **SQL Editor** (icono de terminal en el menú lateral).
2. Pulsa **"New query"**, pega el contenido de `supabase/schema.sql` y ejecuta con **"Run"**.
3. Verás los mensajes `Success. No rows returned` para cada sentencia — eso es correcto.

> El script activa automáticamente Row Level Security y Realtime para la tabla `votes`.

### Paso 3 — Obtén las credenciales

1. En el panel de Supabase ve a **Project Settings → API**.
2. Copia los dos valores que necesitarás en el paso siguiente:
   - **Project URL** (algo como `https://xyzabc.supabase.co`)
   - **anon / public key** (la clave pública larga que empieza por `eyJ...`)

### Paso 4 — Configura las variables de entorno en Vercel

1. En el panel de Vercel, abre tu proyecto y ve a **Settings → Environment Variables**.
2. Añade las dos variables siguientes (para los entornos **Production**, **Preview** y **Development**):

   | Nombre | Valor |
   |--------|-------|
   | `PUBLIC_SUPABASE_URL` | `https://xyzabc.supabase.co` |
   | `PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (la anon key) |

3. Guarda los cambios y **haz un nuevo deploy** (pestaña **Deployments → Redeploy**).

### Paso 5 — Verifica que funciona

Abre la aplicación desplegada, introduce el nombre de un concurso y pulsa **Crear Concurso**. Si todo está bien, serás redirigido al dashboard del concurso.

---

## Desarrollo local

### 1. Configura las variables de entorno

Crea un archivo `.env.local` basándote en `.env.example`:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 2. Instala las dependencias y arranca

```bash
npm install
npm run dev
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── CreateContestForm.tsx   # Formulario de creación con selector de tipo
│   ├── VotingForm.tsx          # Formulario de votación con sliders
│   └── Leaderboard.tsx         # Clasificación en tiempo real
├── layouts/
│   └── BaseLayout.astro        # Layout principal (dark, max-w-md)
├── lib/
│   ├── contestTypes.ts         # Tipos predefinidos y criterios
│   └── supabase.ts             # Cliente Supabase + tipos
└── pages/
    ├── index.astro             # Landing / crear concurso
    ├── c/[id].astro            # Dashboard del organizador
    ├── vote/[id].astro         # Página de votación (sin registro)
    └── api/
        ├── contests.ts         # POST /api/contests
        └── votes.ts            # POST /api/votes
```

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Vista previa del build
npx astro check  # Comprobación de tipos TypeScript
```

## Licencia

ISC
