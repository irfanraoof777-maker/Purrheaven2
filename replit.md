# PurrHeaven

A full-stack cat fostering platform for India — connecting cats in need of temporary homes with kind-hearted fosters across 15 major cities.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/purrheaven run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, wouter routing, TanStack Query
- API: Express 5, express-session (session-based auth)
- Storage: In-memory arrays (users, cats, comments) — no database needed yet
- Fonts: Playfair Display (headings), DM Sans (body) via Google Fonts
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/` — Generated Zod validation schemas
- `artifacts/api-server/src/lib/store.ts` — In-memory data store (users, cats, comments + seed data)
- `artifacts/api-server/src/routes/` — auth.ts, cats.ts, comments.ts, users.ts
- `artifacts/purrheaven/src/pages/` — All page components (home, cats, post, login, my-listings, about, contact)
- `artifacts/purrheaven/src/components/layout/` — Navbar, Footer
- `artifacts/purrheaven/src/lib/constants.ts` — Indian cities list

## Architecture decisions

- In-memory storage in `store.ts` — all users, cats, comments live as module-level arrays. Restarting the server resets them (intended for now, DB to be added later).
- Session auth via express-session — cookie-based sessions, no JWT. SESSION_SECRET env var used when available.
- Photo storage via URL — cats store photo URLs rather than binary uploads. Multer is installed for future binary upload support.
- OpenAPI-first — all endpoints defined in openapi.yaml, codegen produces typed hooks and Zod schemas for both client and server.
- Replies restricted to cat owner — only the user who posted a cat can reply to comments on that listing.

## Product

- **Home** — hero, featured cats, site stats (total cats, cities, fosters)
- **Browse Cats** (`/cats`) — full grid with instant city filter dropdown
- **Cat Detail** (`/cats/:id`) — dual photos, cat info, comment section with replies
- **Post a Cat** (`/post`) — auth-gated form to list a cat (URL-based photos with live preview)
- **Login / Signup** (`/login`) — toggling forms, test account: testuser / cat123
- **My Listings** (`/my-listings`) — user's cats with delete
- **About** (`/about`) — mission, story, team
- **Contact** (`/contact`) — contact form UI
- **Donate button** — always visible in navbar, shows modal (no payment gateway)

## Seed Data

6 cats pre-loaded (Mochi, Simba, Luna, Biscuit, Oreo, Noodle) across Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune.
Test user: `testuser` / `cat123`

## Gotchas

- After any OpenAPI spec change, always run codegen before starting the server or frontend.
- Session middleware must come before route handlers in app.ts.
- Photos use placekitten.com URLs in seed data — these are external URLs that may occasionally be slow.
- The `artifacts/api-server/public/uploads/` directory exists for future multer file uploads.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
