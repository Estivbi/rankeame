---
name: rankeame
description: Real-time voting PWA with Astro, React, Tailwind, and Supabase. Frictionless zero-auth voting system.
---

# rankeame

A frictionless, real-time voting PWA for friends (contests, ratings, etc.) with ZERO authentication requirements for voters.

## When to use

Use this skill when building or modifying the Rankeame voting PWA. This includes:
- Creating contest pages and voting interfaces
- Implementing real-time leaderboards
- Setting up Supabase database operations
- Building React islands for interactive components
- Styling with Tailwind CSS and Shadcn/ui
- Configuring PWA capabilities

## Skills Required

This project relies on the following skills (install with `npx skills add`):
- `@skills/astro` - For Astro framework
- `@skills/tailwind` - For Tailwind CSS styling
- `@skills/react` - For React islands
- `@skills/supabase` - For database and real-time features

## Tech Stack

- **Framework:** Astro (SSR mode)
- **UI & Styling:** Tailwind CSS + Shadcn/ui
- **Interactivity:** React (`@astrojs/react`) for interactive islands only
- **Database & Realtime:** Supabase
- **PWA:** `@vite-pwa/astro` for installability

## Core Business Rules

### Frictionless Zero-Auth Flow
1. **NO USER REGISTRATION REQUIRED** - This is the core principle
2. Contest creator becomes "Host" via local `hostToken` in `localStorage`
3. Guests access via shareable URL/PIN and vote with temporary display name only
4. All state is ephemeral - no passwords, no emails, no user accounts

### User Flow
1. User creates a contest → Saved to Supabase
2. Creator gets `hostToken` stored in `localStorage`
3. App generates shareable URL/PIN for guests
4. Guests visit URL, enter display name, and vote immediately
5. Real-time results update for all participants

## Development Guidelines

### File Structure
```
src/
├── components/
│   ├── islands/     # React islands for interactivity
│   └── ui/          # Shadcn/ui components
├── layouts/         # Astro layouts
├── pages/           # Astro pages (SSR)
├── lib/
│   ├── supabase.ts  # Supabase client
│   └── utils.ts     # Utility functions
└── styles/          # Global styles
```

### Code Patterns

#### Astro Pages
- Use SSR mode for all pages
- Keep pages simple and delegate interactivity to React islands
- Use Astro components for static content

#### React Islands
- Use ONLY for interactive features (voting sliders, real-time updates)
- Keep islands small and focused
- Use `client:load` or `client:visible` directives appropriately
- NO global state management (no Redux)
- Use React state or Zustand only if strictly necessary

#### Styling
- Mobile-first approach (`max-w-md mx-auto` for main containers)
- Dark theme by default
- Use Tailwind utility classes
- Use Shadcn/ui for consistent components
- Keep components visually simple and clean

#### Supabase
- Use Row Level Security (RLS) policies
- Implement real-time subscriptions for live voting
- Store minimal data: contests, votes, participants
- Use `hostToken` for host verification (NOT authentication)

### Do NOT

- ❌ Implement Email/Password authentication
- ❌ Create user registration systems
- ❌ Use complex global state management (Redux)
- ❌ Make components too large or complex
- ❌ Forget mobile-first responsive design
- ❌ Use React for static content (use Astro components instead)

### Do

- ✅ Rely on official skills for Astro, Tailwind, React, and Supabase
- ✅ Keep the voting experience instant and frictionless
- ✅ Use `localStorage` for host tokens
- ✅ Implement real-time updates with Supabase subscriptions
- ✅ Design for mobile screens first
- ✅ Use TypeScript for type safety
- ✅ Make PWA installable with proper manifest and service worker

## Database Schema

### contests
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `host_token` (text) - for host verification
- `pin` (text) - shareable PIN
- `created_at` (timestamp)
- `expires_at` (timestamp)
- `options` (jsonb) - contest items/options

### votes
- `id` (uuid, primary key)
- `contest_id` (uuid, foreign key)
- `participant_name` (text) - temporary display name
- `vote_data` (jsonb) - vote details
- `created_at` (timestamp)

## PWA Configuration

- Use `@vite-pwa/astro` for PWA capabilities
- Configure manifest.json with app name, icons, theme colors
- Implement service worker for offline support
- Make app installable on mobile devices

## Example Commands

```bash
# Install skills
npx skills add @skills/astro
npx skills add @skills/tailwind
npx skills add @skills/react
npx skills add @skills/supabase

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```
