# Architecture

## Overview

TutorConnect is a role-based tutoring marketplace. Parents create cases and invite tutors; tutors manage invitations and profiles. The frontend is a **Next.js 16 App Router** app that talks to the **TutorConnect REST API** via an OpenAPI-generated client and **TanStack Query**.

```
┌──────────────────────────────────────────────────────────────────┐
│                     Next.js App Router                            │
├──────────────────────────────────────────────────────────────────┤
│  proxy.ts (route guard)  │  AppShell (client auth guard)         │
│  Public: /login, /docs   │  Protected: /dashboard, /cases, …    │
├──────────────────────────────────────────────────────────────────┤
│  AuthProvider + TanStack Query                                    │
│  JWT in localStorage + cookie (tutorconnect-token)                │
├──────────────────────────────────────────────────────────────────┤
│  src/api/ (generated SDK)  →  tutorConnect-api REST API           │
└──────────────────────────────────────────────────────────────────┘
```

## Design decisions

### Server vs client components

- **Route pages** are thin wrappers; `*View` client components own UI and data fetching.
- **Detail pages** may prefetch on the server where useful; most list/detail data comes from React Query hooks calling the API.

### Feature-based folders

Components are grouped by domain (`cases/`, `tutors/`, `profile/`) rather than by type. Shared primitives live in `common/` and `ui/`.

### Server-side lists

List pages (cases, tutors, invitations) use **server-side pagination, search, and filters** via API query params. Search inputs are debounced (~300 ms) before hitting the API — see `components/common/list-filter-toolbar.tsx`.

### Data access

- **Generated client:** `src/api/sdk.gen.ts`, `types.gen.ts`, `@tanstack/react-query.gen.ts`
- **Query helpers:** `lib/queries/list-queries.ts`, `invalidate.ts`, `query-keys.ts`
- **Mutations:** shared hooks like `useCaseInvitationMutations`, pending-action hooks for optimistic UX

Do **not** hand-edit `*.gen.ts` files — regenerate with `npm run generate:api`.

### Route protection (Next.js 16)

`src/proxy.ts` replaces the deprecated `middleware.ts`. It checks the `tutorconnect-token` cookie and redirects unauthenticated users from protected routes. `AppShell` provides a second client-side guard after hydration.

### Error handling

`lib/api-error.ts` sanitizes API errors before showing them in toasts — internal Prisma/DB messages are never shown to users.

### UI system

- **shadcn/ui** primitives in `components/ui/`
- **Tailwind CSS v4** for styling
- Shared patterns: `EmptyState`, `ErrorState`, `StatusBadge`, `PageHeader`, `ListFilterToolbar`

## Role model

| Role | Capabilities |
|------|--------------|
| **Parent** | Create/edit cases, invite tutors, upload case documents, browse tutor directory |
| **Tutor** | View invited cases, accept/decline invitations, manage profile (gated until complete) |

Access is enforced via proxy + AppShell, API authorization, and UI role checks (e.g. `canManage` on case detail).

## Tutor profile gate

Incomplete tutor profiles are redirected to `/profile/edit` by `TutorProfileGate` — tutors must fill qualifications, subjects, and background before using the main app.
