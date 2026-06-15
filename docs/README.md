# TutorConnect Frontend Documentation

This folder documents the **Tuition Marketplace** frontend (`tuition-marketplace/`).

## Quick access

| Resource | Location |
|----------|----------|
| **Storybook (primary)** | `npm run storybook` → [http://localhost:6006](http://localhost:6006) — Guides: Architecture, Auth, Routing, Data |
| Live docs UI | `npm run dev` → [http://localhost:3000/docs](http://localhost:3000/docs) |
| Architecture | [architecture.md](./architecture.md) |
| Components | [components.md](./components.md) |
| Routing & pages | [routing.md](./routing.md) |
| Auth & access control | [auth-and-access-control.md](./auth-and-access-control.md) |
| Data layer | [data-layer.md](./data-layer.md) |
| Getting started | [getting-started.md](./getting-started.md) |
| API reference | [../tutorConnect-api/README.md](../../tutorConnect-api/README.md) |

## Stack

- **Next.js 16** (App Router, `proxy.ts` route protection)
- **React 19** + **TypeScript**
- **TanStack Query v5** — server-side pagination, cache, mutations
- **Tailwind CSS v4** + **shadcn/ui**
- **OpenAPI-generated client** — `src/api/` from `tutorConnect-api/openapi.json`
- **react-hook-form** + **Zod** (auth forms)

## Demo credentials

Requires a running API with seeded data (`npm run db:seed` in `tutorConnect-api`):

| Role | Email | Password |
|------|-------|----------|
| Parent | `sarah@example.com` | `Password1` |
| Tutor | `james@example.com` | `Password1` |

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

For production, point this at your deployed API and ensure the frontend origin is in the API `CORS_ORIGINS`.
