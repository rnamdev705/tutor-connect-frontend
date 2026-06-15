# Auth & Access Control

## Overview

Authentication uses **JWT** from the TutorConnect API. The token is stored in `localStorage` and mirrored to a **cookie** so Next.js `proxy.ts` can guard routes on the first request.

## Key modules

| Module | Responsibility |
|--------|----------------|
| `lib/auth-context.tsx` | `AuthProvider`, `useAuth()` — login, register, logout, session restore |
| `api/setup.ts` | Token storage, cookie sync, API client base URL |
| `lib/validations/auth.ts` | Zod schemas for login/register |
| `src/proxy.ts` | Server-side route protection via cookie |
| `components/layout/app-shell.tsx` | Client-side route protection |
| `lib/api-error.ts` | Safe error messages for UI |

## Session flow

1. User submits login/register form (Zod + react-hook-form).
2. `AuthProvider` calls `POST /auth/login` or `POST /auth/register`.
3. On success, JWT is saved to `localStorage` (`tutorconnect-token`) and synced to a cookie.
4. `GET /auth/me` validates the token and loads the current user.
5. `proxy.ts` reads the cookie on navigation; `AppShell` redirects if no user after hydration.
6. On `401`, the API client interceptor clears the token and sends the user to `/login`.

## Token storage

| Store | Key | Purpose |
|-------|-----|---------|
| `localStorage` | `tutorconnect-token` | Bearer token for API requests |
| Cookie | `tutorconnect-token` | Read by `proxy.ts` on server |

`syncAuthCookieFromStorage()` in `api/setup.ts` keeps the cookie in sync after page load.

## Access control patterns

### Route-level

- **Proxy:** blocks protected paths when no cookie token.
- **AppShell:** redirects unauthenticated users to `/login?next=<path>`.
- **TutorProfileGate:** redirects incomplete tutors to `/profile/edit`.

### Feature-level

Components check `user.role` and API-enforced ownership:

```tsx
const canManage = user?.role === "parent" && caseData.ownerId === user.id;
```

Examples:
- **Case edit / invite / documents** — parent owner only (API also enforces)
- **Accept/decline invitation** — tutor only
- **Profile documents** — tutor profile owner only

### Unauthorized page

`/unauthorized` for explicit access-denied messaging.

## Validation rules (register)

- Name: 2–80 characters
- Email: valid format (uniqueness checked by API)
- Password: min 8 chars, uppercase, lowercase, number
- Confirm password must match

## Demo users

Seeded by the API (`npm run db:seed` in `tutorConnect-api`) — see [getting-started.md](./getting-started.md).

## Safe errors

Internal server, Prisma, and database errors are never shown in the UI. `getApiErrorMessage()` returns user-friendly copy; technical codes remain in the Network tab for debugging.
