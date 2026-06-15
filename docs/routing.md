# Routing & Pages

All routes use the Next.js **App Router** (`src/app/`).

## Route protection

Two layers:

1. **`src/proxy.ts`** (Next.js 16 — replaces deprecated `middleware.ts`) — checks `tutorconnect-token` cookie on first request; redirects to `/login` for protected paths.
2. **`AppShell`** — client-side guard after hydration; redirects if no authenticated user.

Public paths skip the cookie check. Logged-in users hitting `/login` or `/register` are redirected to `/dashboard`.

## Public routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Redirects to `/dashboard` or `/login` |
| `/login` | `app/login/page.tsx` | Login form |
| `/register` | `app/register/page.tsx` | Registration form |
| `/docs` | `app/docs/page.tsx` | In-app documentation |
| `/unauthorized` | `app/unauthorized/page.tsx` | Access denied page |
| `404` | `app/not-found.tsx` | Page not found |

## Protected routes (`app/(app)/`)

Wrapped by `AppShell`.

| Route | Page | Primary component |
|-------|------|-------------------|
| `/dashboard` | `dashboard/page.tsx` | Parent or Tutor dashboard |
| `/cases` | `cases/page.tsx` | `CasesListView` |
| `/cases/new` | `cases/new/page.tsx` | `CaseFormView` (create) |
| `/cases/[id]` | `cases/[id]/page.tsx` | `CaseDetailView` |
| `/cases/[id]/edit` | `cases/[id]/edit/page.tsx` | `CaseFormView` (edit) |
| `/cases/[id]/documents` | `cases/[id]/documents/page.tsx` | `CaseDocumentsView` |
| `/cases/[id]/tutors` | `cases/[id]/tutors/page.tsx` | Invited tutors sub-view |
| `/tutors` | `tutors/page.tsx` | `TutorsDirectoryView` |
| `/tutors/[id]` | `tutors/[id]/page.tsx` | `TutorProfileDetailView` |
| `/invitations` | `invitations/page.tsx` | `InvitedCasesView` (tutor) |
| `/profile` | `profile/page.tsx` | `ProfilePageView` |
| `/profile/edit` | `profile/edit/page.tsx` | `ProfileEditView` |

## Navigation by role

**Parent sidebar:** Dashboard → My Cases → Tutor Directory → Profile

**Tutor sidebar:** Dashboard → Invited Cases → My Profile

## Data fetching pattern

List views use TanStack Query with server-side pagination:

```tsx
const { data, isLoading } = useQuery(
  casesListQueryOptions({ page, limit, search, status, subject, level }),
);
```

Search and filter state is debounced and synced to URL query params via `useUrlSyncedSearch` in `ListFilterToolbar`.

## Migrating from middleware

Next.js 16 renamed `middleware.ts` → `proxy.ts` and `middleware()` → `proxy()`. This project uses `src/proxy.ts`. To migrate older code:

```bash
npx @next/codemod@canary middleware-to-proxy .
```
