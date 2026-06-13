# Auth & Access Control

## Overview

Authentication is **client-side** for this prototype, using React Context and `localStorage`. Suitable for demo/MVP; production would use HTTP-only cookies and a real API.

## Key modules

| Module | Responsibility |
|--------|----------------|
| `lib/auth-context.tsx` | `AuthProvider`, `useAuth()` hook |
| `lib/auth-store.ts` | Credential validation, registration, user storage |
| `lib/validations/auth.ts` | Zod schemas for login/register |
| `components/layout/app-shell.tsx` | Route protection (redirect if not logged in) |

## Session flow

1. User submits login/register form (validated with Zod + react-hook-form).
2. `auth-store` validates credentials against demo + registered users.
3. `AuthProvider` persists the public `User` object to `localStorage` (`tutorconnect-auth`).
4. On app load, session is restored from `localStorage`.
5. `AppShell` redirects to `/login` if no user after hydration.

## Registration

New users are appended to `localStorage` under `tutorconnect-users`. Demo users are always available and cannot be overwritten.

## Access control patterns

### Route-level

`AppShell` blocks all `(app)` routes for unauthenticated users.

### Feature-level

Components check `user.role` and ownership:

```tsx
const canManage = user?.role === "parent" && user.id === caseData.ownerId;
```

Examples:
- **Case edit / invite** — parent owner only
- **Invite tutor on profile** — parent role only (`TutorProfileDetailView`)
- **Invited cases** — tutor workflow via `useCurrentTutor()`

### Unauthorized page

`/unauthorized` for explicit access-denied messaging (e.g. future route guards).

## Validation rules (register)

- Name: 2–80 characters
- Email: valid format, unique
- Password: min 8 chars, uppercase, lowercase, number
- Confirm password must match

## Demo users

Seeded in `auth-store.ts` — see [getting-started.md](./getting-started.md).
