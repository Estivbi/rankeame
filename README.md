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
- **Base de datos**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Despliegue**: Node.js standalone (adaptador `@astrojs/node`)

## Primeros pasos

### 1. Configura las variables de entorno

Crea un archivo `.env` basándote en `.env.example`:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 2. Crea las tablas en Supabase

Ejecuta el contenido de `supabase/schema.sql` en el editor SQL de tu proyecto Supabase.

> **Si actualizas desde una instalación anterior**, ejecuta también:
> ```sql
> alter table contests add column if not exists contest_type text not null default 'tortillas';
> ```

### 3. Instala las dependencias y arranca

```bash
npm install
npm run dev
```

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
