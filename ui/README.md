# ui

Next.js 15 + React 19 frontend application. Hebrew-first, RTL layout.
Handles all user-facing pages and the BFF (Backend-for-Frontend) API route handlers
that translate domain types into frontend DTOs.

## Responsibility

- Page routing and server components (`src/app/`)
- React UI components — vehicle, parts, suppliers, layout, primitives (`src/components/`)
- BFF route handlers under `src/app/api/` — call into `data-engine` services and shape responses for the client
- TanStack Query hooks, Zustand store, formatting utilities (`src/hooks/`, `src/lib/`, `src/stores/`)
- Tailwind styling, public assets (category/part images)

## Dev

```bash
npm run dev       # Next.js dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

## Moved from

`frontend/` — all contents copied here verbatim.

## Package references to update after restructure

- `@partpilot/backend` → `@partpilot/data-engine` (once `backend/` is renamed)
- `sync:supplier-prices` script prefix path will change once `data-engine/` is reorganised
