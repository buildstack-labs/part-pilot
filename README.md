# PartPilot

Israeli vehicle parts discovery platform — Hebrew-first, RTL.

## Structure

```
part-pilot/
├── backend/          # Domain logic, mocks, services (imported by Next.js API routes)
│   └── src/
│       ├── mocks/    # Static fixtures — swap for DB/gov.il later
│       ├── services/ # Vehicle, parts, supplier business logic
│       └── types/
├── frontend/         # Next.js 15 + React 19 App Router
│   └── src/
│       ├── app/      # Pages + Route Handlers (/api/*)
│       ├── components/
│       ├── hooks/    # TanStack Query wrappers
│       ├── lib/
│       ├── schemas/  # Zod validation
│       └── stores/   # Zustand client state
├── assets/           # Original brand/part images (copied to frontend/public)
└── partpilot.jsx     # Original prototype (reference)
```

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo license plates

| Plate       | Vehicle              | Parts catalog |
|-------------|----------------------|---------------|
| 12-345-67   | Hyundai i20 2019     | ✅            |
| 98-765-43   | Toyota Corolla 2021  | ✅            |
| 55-123-89   | Kia Sportage 2020    | ✅            |
| 77-432-11   | Honda Jazz 2018      | ✅            |
| 33-987-55   | Mazda 3 2022         | ✅            |
| 64-519-74   | Hyundai i10 2011     | ❌ (vehicle only) |

## API routes (mock-backed)

- `GET /api/vehicles/{plate}` — vehicle lookup
- `GET /api/vehicles/{plate}/parts` — category catalog
- `GET /api/vehicles/{plate}/parts/{category}` — parts in category
- `GET /api/parts/{partId}` — part detail
- `GET /api/parts/{partId}/suppliers?filter=all|local|international`

## Tech stack

- **Next.js 15** + **React 19** + TypeScript + Tailwind CSS
- **TanStack Query** — server state
- **Zustand** — recent searches (localStorage)
- **React Hook Form + Zod** — plate validation

## Future migration

Replace `@partpilot/backend` service implementations with ASP.NET Core API calls — Route Handlers stay as a thin BFF layer or can be removed in favor of direct client → .NET calls.
