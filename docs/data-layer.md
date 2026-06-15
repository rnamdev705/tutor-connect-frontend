# Data Layer

## Overview

The frontend uses an **OpenAPI-generated API client** with **TanStack Query** for caching, pagination, and mutations. There is no mock data layer — all reads and writes go to `tutorConnect-api`.

## Generated client (`src/api/`)

| File | Purpose |
|------|---------|
| `types.gen.ts` | Request/response TypeScript types |
| `sdk.gen.ts` | Fetch functions for each endpoint |
| `@tanstack/react-query.gen.ts` | `*Options` and `*Mutation` helpers |
| `setup.ts` | Base URL, auth header, 401 interceptor |

Regenerate after API changes:

```bash
cd ../tutorConnect-api && npm run openapi:export
cd ../tuition-marketplace && npm run generate:api
```

**Never hand-edit `*.gen.ts` files.**

## Query helpers (`lib/queries/`)

| Module | Purpose |
|--------|---------|
| `list-queries.ts` | Shared options for cases, tutors, invitations lists |
| `query-keys.ts` | Centralized query key constants |
| `invalidate.ts` | Predicate-based cache invalidation |
| `case-detail-cache.ts` | Optimistic patches for case detail / invitations |

### List defaults

- Server-side `page`, `limit`, `search`, and filter params
- `staleTime: 60_000`, `placeholderData: keepPreviousData`
- Search debounced 300 ms in `ListFilterToolbar`

## Hooks (`lib/hooks/`)

| Hook | Purpose |
|------|---------|
| `useAuth()` | Current user + auth actions (`auth-context.tsx`) |
| `useCurrentTutor()` | Tutor profile for logged-in tutor |
| `useCaseInvitationMutations` | Shared invite/revoke for case views |
| `usePendingInvitationResponses` | Accept/decline with loading + optimistic cache |
| `usePendingInvites` / `usePendingDocumentUploads` / … | Optimistic pending-action UX |

## User type

`lib/app-user.ts` — `AppUser` type and `mapApiUser()` bridge API responses to UI-friendly shape (lowercase roles, etc.).

## Upload constraints

Defined in `lib/constants.ts` (must match API):

- **Allowed types:** PDF, DOCX, PNG, JPEG
- **Max size:** 10 MB

Validated client-side before upload; API validates again server-side.

## Cache invalidation

After mutations, use helpers in `lib/queries/invalidate.ts` rather than ad-hoc `queryClient.invalidateQueries` — keys are matched by predicate to avoid missing related queries.

## Environment

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Production: set to your deployed API URL and add the frontend origin to API `CORS_ORIGINS`.

## Error handling

```tsx
import { getApiErrorMessage } from "@/lib/api-error";

onError: (error) => toast.error(getApiErrorMessage(error)),
```

Filters Prisma codes, stack traces, and connection errors from user-visible messages.
