# Getting Started

## Prerequisites

- Node.js 20+
- npm
- Running **TutorConnect API** — see [`tutorConnect-api/README.md`](../../tutorConnect-api/README.md)

## Full local setup

### 1. Start the API

```bash
cd tutorConnect-api
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed          # demo users, cases, invitations
npm run dev
```

API: `http://localhost:3001/api/v1` · Swagger: `http://localhost:3001/api-docs`

### 2. Start the frontend

```bash
cd tuition-marketplace
npm install
cp .env.example .env.local    # optional — defaults to localhost API
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Resource | URL |
|----------|-----|
| App | [http://localhost:3000](http://localhost:3000) |
| Docs UI | [http://localhost:3000/docs](http://localhost:3000/docs) |
| Storybook | `npm run storybook` → [http://localhost:6006](http://localhost:6006) |

## Demo login

After API seed:

| Role | Email | Password |
|------|-------|----------|
| Parent | `sarah@example.com` | `Password1` |
| Tutor | `james@example.com` | `Password1` |
| Tutor | `alice@example.com` | `Password1` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (regenerates API client first) |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run generate:api` | Regenerate client from OpenAPI spec |
| `npm run storybook` | Component catalog |

## Project structure

```
src/
├── app/                 # Next.js routes (App Router)
├── api/                 # Generated OpenAPI client
├── components/          # Feature & shared UI
│   ├── auth/
│   ├── cases/
│   ├── common/
│   ├── dashboard/
│   ├── docs/
│   ├── layout/
│   ├── modals/
│   ├── profile/
│   ├── providers/
│   └── tutors/
├── lib/
│   ├── auth-context.tsx
│   ├── queries/
│   ├── hooks/
│   └── validations/
├── proxy.ts             # Route protection (Next.js 16)
└── stories/             # Storybook fixtures
docs/                    # Markdown documentation (this folder)
```

## Production deploy

1. Deploy API (e.g. Render) with Neon pooled `DATABASE_URL`.
2. Set frontend env: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1`
3. Add frontend URL to API `CORS_ORIGINS`.
4. `npm run build && npm run start`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API requests fail / CORS | Check `CORS_ORIGINS` on API includes frontend URL |
| 401 on every request | Token expired — log in again; check `JWT_SECRET` matches across deploys |
| Empty lists | Ensure API is running and seeded |
| Build fails on API types | Run `npm run generate:api` after pulling API changes |
