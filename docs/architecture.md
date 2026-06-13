# Architecture

## Overview

TutorConnect is a role-based tutoring marketplace prototype. Parents create cases and invite tutors; tutors browse cases and manage invitations. The frontend uses **mock data** with a clear separation between UI, data access, and auth.

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
├─────────────────────────────────────────────────────────┤
│  Public routes          │  Protected routes (AppShell)   │
│  /login, /register      │  /dashboard, /cases, …       │
│  /docs, /unauthorized   │                                │
├─────────────────────────────────────────────────────────┤
│              AuthProvider (React Context)                  │
│              localStorage session persistence            │
├─────────────────────────────────────────────────────────┤
│  lib/data.ts          │  lib/mock-data.ts               │
│  (selectors/stats)    │  (seed data + formatters)       │
└─────────────────────────────────────────────────────────┘
```

## Design decisions

### Server vs client components

- **Server components** are used for detail pages that fetch data by ID (`/cases/[id]`, `/tutors/[id]`) and pass props to client views.
- **Client components** (`"use client"`) wrap interactive UI: forms, modals, auth context, filters, and tables with actions.

### Feature-based folders

Components are grouped by domain (`cases/`, `tutors/`, `profile/`) rather than by type. Shared primitives live in `common/` and `ui/`.

### Data access layer

All mock lookups and stats are centralized in `src/lib/data.ts`. Views should not duplicate filter logic (e.g. `getCasesByOwnerId`, `getParentCaseStats`).

### Conditional rendering

The app uses [`react-if`](https://www.npmjs.com/package/react-if) (`<If>`, `<Then>`, `<Else>`, `<When>`) for readable conditional UI instead of nested ternaries.

### UI system

- **shadcn/ui** primitives in `components/ui/`
- **Tailwind CSS v4** for styling
- Shared patterns: `EmptyState`, `ErrorState`, `StatusBadge`, `SearchInput`, `PageHeader`

## Role model

| Role | Capabilities |
|------|--------------|
| **Parent** | Create/edit cases, invite tutors, upload case documents, browse tutor directory |
| **Tutor** | Browse cases, view invitations, accept invites, manage profile documents |

Access is enforced in the UI via `useAuth()` and role checks (e.g. `canManage` on case detail, `showInvite` on tutor profile).
