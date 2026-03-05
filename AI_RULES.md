# Rankeame PWA - AI Assistant Rules

## 1. Project Identity & Business Logic
* **App:** A frictionless, real-time voting PWA for friends (contests, ratings, etc.).
* **Frictionless Rule (Zero Auth MVP):** NO USER REGISTRATION REQUIRED. 
* **Flow:** 1. A user creates a contest -> Saved to Supabase.
  2. The creator becomes "Host" via a local `hostToken` stored in `localStorage`.
  3. The app generates a shareable URL/PIN for "Guests" to vote.
  4. Guests visit the URL, enter a temporary display name, and vote.

## 2. Tech Stack (Strict)
* **Framework:** Astro (SSR mode).
* **UI & Styling:** Tailwind CSS + Shadcn/ui. Mobile-first, dark-theme default.
* **Interactivity:** React (`@astrojs/react`) ONLY for interactive islands (e.g., voting sliders, real-time leaderboards).
* **Database & Realtime:** Supabase.
* **PWA:** `@vite-pwa/astro` for installability.

## 3. Development Rules
* Rely on the official skills installed via `@skills/cli` for Astro, Tailwind, React, and Supabase.
* **DO NOT** implement traditional Email/Password authentication.
* **DO NOT** use complex global state management (no Redux). Use React state or Zustand if strictly necessary for the voting island.
* Keep components small. Design for a mobile screen (`max-w-md mx-auto`).
