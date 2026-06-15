# TutorConnect — Tuition Marketplace (Frontend)

Next.js 16 frontend for the TutorConnect tuition marketplace. Connects to the REST API in [`tutorConnect-api`](../tutorConnect-api) via an OpenAPI-generated client and TanStack Query.

## Prerequisites

- Node.js 20+
- Running API (local or deployed) — see [`tutorConnect-api/README.md`](../tutorConnect-api/README.md)

## Getting started

```bash
npm install
cp .env.example .env.local    # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL including `/api/v1` | `http://localhost:3001/api/v1` |

### Demo credentials (after API seed)

| Role | Email | Password |
|------|-------|----------|
| Parent | `sarah@example.com` | `Password1` |
| Tutor | `james@example.com` | `Password1` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `generate:api` first) |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run generate:api` | Regenerate client from `../tutorConnect-api/openapi.json` |
| `npm run storybook` | Component catalog at [http://localhost:6006](http://localhost:6006) |
| `npm run build-storybook` | Static Storybook build |

## Features

- **Parent:** Dashboard, case management, tutor directory, invite tutors, upload documents
- **Tutor:** Dashboard, invitation inbox (accept/decline), profile management, document uploads
- **Shared:** Server-side list pagination & search, role-based sidebar, status badges, empty/loading/error states
- **Auth:** JWT login/register, cookie + localStorage token sync, route protection via Next.js proxy

## Tech stack

- Next.js 16 (App Router, `proxy.ts` for route protection)
- React 19 + TypeScript
- TanStack Query v5
- Tailwind CSS v4 + shadcn/ui
- OpenAPI-generated SDK (`src/api/`)
- Zod + react-hook-form (auth forms)

## Project structure

```
src/
├── app/                 # Next.js routes
├── api/                 # Generated OpenAPI client (do not hand-edit *.gen.ts)
├── components/          # Feature UI (cases, tutors, profile, layout, modals, …)
├── lib/
│   ├── auth-context.tsx
│   ├── queries/         # React Query options, invalidation, cache helpers
│   ├── hooks/           # Pending-action & mutation hooks
│   └── validations/
├── proxy.ts             # Route protection (Next.js 16 — replaces middleware.ts)
└── stories/             # Storybook stories
docs/                    # Markdown documentation
```

## Documentation

| Resource | Location |
|----------|----------|
| Markdown docs | [`docs/README.md`](./docs/README.md) |
| Live docs UI | [http://localhost:3000/docs](http://localhost:3000/docs) (when running) |
| Storybook | `npm run storybook` → [localhost:6006](http://localhost:6006) — Guides + component stories |

## Production deploy

1. Deploy the API first and note its public URL.
2. Set `NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1` in your frontend host.
3. Add the frontend origin to the API `CORS_ORIGINS` env var.
4. Build: `npm run build` · Start: `npm run start`

## API client regeneration

When backend routes or schemas change:

```bash
cd ../tutorConnect-api && npm run openapi:export
cd ../tuition-marketplace && npm run generate:api
```

Never hand-edit files in `src/api/*.gen.ts`.
