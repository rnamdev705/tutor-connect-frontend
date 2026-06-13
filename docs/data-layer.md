# Data Layer

## Overview

The app uses **in-memory mock data** (`lib/mock-data.ts`) with a thin **data access layer** (`lib/data.ts`). No external API client is required for the prototype.

## `lib/data.ts` — selectors & stats

| Function | Returns |
|----------|---------|
| `getCaseById(id)` | Single case or `undefined` |
| `getTutorById(id)` | Tutor profile or `undefined` |
| `getTutorByUserId(userId)` | Links auth user → tutor profile |
| `getCasesByOwnerId(ownerId)` | Cases owned by a parent |
| `getParentCaseStats(ownerId)` | Dashboard stats for parents |
| `getInvitationsForTutor(tutorId)` | Case invitations for a tutor |
| `getTutorDashboardStats(tutor)` | Dashboard stats for tutors |

## `lib/mock-data.ts`

Contains seed data: users, tutors, cases, invitations, documents, and formatters (`formatDate`, `formatCurrency`, `formatFileSize`, etc.).

## `lib/types.ts`

Domain TypeScript interfaces: `User`, `Case`, `TutorProfile`, `CaseInvitation`, `Document`, `CaseStatus`.

## Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useAuth()` | `auth-context.tsx` | Current user + auth actions |
| `useCurrentTutor()` | `hooks/use-current-tutor.ts` | Resolve tutor profile for logged-in tutor |

## Upload constraints

Defined in `lib/constants.ts`:

- **Allowed types:** PDF, DOC, DOCX, PNG, JPEG
- **Max size:** 10 MB

Validated in `UploadDocumentModal.validateFile()` before upload simulation.

## Future API integration

Replace `lib/data.ts` implementations with fetch calls to a REST API. Keep the same function signatures so views require minimal changes. Auth would move to cookie/JWT-based sessions with a dedicated API client module.
