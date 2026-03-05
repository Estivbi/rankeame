# Rankeame

> Votaciones en tiempo real sin registro — crea un concurso, comparte el enlace y votad juntos.

Rankeame es una aplicación web PWA que permite a cualquier grupo de personas crear un concurso de puntuación, compartir el enlace con sus amigos y ver cómo se actualiza la clasificación en tiempo real, todo ello sin necesidad de crear una cuenta.

---

## Características

- **Sin registro** — flujo Zero Auth: el anfitrión sólo necesita un nombre para el concurso.
- **Enlace + PIN compartible** — se genera automáticamente una URL y un PIN (últimos 6 caracteres del UUID del concurso) para invitar a los votantes.
- **Puntuación con sliders (1–10)** — interfaz intuitiva para puntuar cada elemento.
- **Clasificación en tiempo real** — actualización instantánea via Supabase Realtime sin recargar la página.
- **PWA instalable** — se puede añadir a la pantalla de inicio en móvil o escritorio.
- **Un voto por participante** — la restricción de unicidad `(contest_id, guest_name)` evita duplicados.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Astro 5](https://astro.build) (SSR, adaptador Node) |
| UI interactiva | [React 19](https://react.dev) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) |
| Base de datos | [Supabase](https://supabase.com) (Postgres + Realtime) |
| PWA | [vite-plugin-pwa](https://vite-pwa-org.netlify.app) + Workbox |
| Lenguaje | TypeScript |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── CreateContestForm.tsx   # Formulario para crear un concurso (React)
│   ├── VotingForm.tsx          # Formulario de votación con sliders (React)
│   └── Leaderboard.tsx         # Tabla de clasificación en tiempo real (React)
├── layouts/
│   └── BaseLayout.astro        # Layout HTML base con meta PWA
├── lib/
│   └── supabase.ts             # Cliente Supabase + tipos Contest / Vote
├── pages/
│   ├── index.astro             # Página de inicio — crear concurso
│   ├── c/[id].astro            # Dashboard del concurso — enlace, PIN y clasificación
│   ├── vote/[id].astro         # Página de votación para participantes
│   └── api/
│       ├── contests.ts         # POST /api/contests — crear concurso
│       └── votes.ts            # POST /api/votes   — enviar voto
└── styles/
    └── global.css              # Variables de diseño y estilos globales
supabase/
└── schema.sql                  # Esquema de tablas, RLS y Realtime
```

---

## Esquema de base de datos

```sql
-- Concursos creados por el anfitrión
contests (
  id          uuid PRIMARY KEY,
  name        text NOT NULL,
  host_token  text NOT NULL,   -- guardado en localStorage del anfitrión
  created_at  timestamptz
)

-- Votos de cada participante
votes (
  id          uuid PRIMARY KEY,
  contest_id  uuid REFERENCES contests(id) ON DELETE CASCADE,
  guest_name  text NOT NULL,
  scores_json jsonb NOT NULL,  -- { "Elemento 1": 8, "Elemento 2": 5, ... }
  created_at  timestamptz,
  UNIQUE (contest_id, guest_name)
)
```

Row Level Security (RLS) habilitado en ambas tablas. Realtime activado en `votes` para actualizar la clasificación en vivo.

---

## Flujo de uso

1. El **anfitrión** entra en `/`, introduce un nombre y crea el concurso.
2. Se genera un enlace `/vote/<id>` y un **PIN** (últimos 6 caracteres del UUID).
3. El anfitrión comparte el enlace o el PIN con los participantes.
4. Cada **participante** accede a `/vote/<id>`, introduce su nombre y puntúa los elementos con sliders (1–10).
5. El anfitrión (y cualquiera con el enlace) puede ver la **clasificación en tiempo real** en `/c/<id>`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (obtenidas del panel de Supabase → Settings → API):

```env
PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

---

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve al **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`.
3. Copia la URL y la clave anónima en tu `.env`.

---

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la build
npm run preview
```

---

## API

### `POST /api/contests`

Crea un nuevo concurso.

**Body:**
```json
{ "name": "Los mejores sitios de pizza" }
```

**Respuesta 201:**
```json
{ "id": "uuid", "name": "...", "created_at": "...", "hostToken": "uuid" }
```

---

### `POST /api/votes`

Envía el voto de un participante.

**Body:**
```json
{
  "contest_id": "uuid",
  "guest_name": "María",
  "scores_json": { "Elemento 1": 8, "Elemento 2": 5, "Elemento 3": 10 }
}
```

**Respuesta 201:**
```json
{ "id": "uuid", "created_at": "..." }
```

> Las puntuaciones deben ser enteros entre 1 y 10. El par `(contest_id, guest_name)` debe ser único.

---

## Licencia

ISC
