# Routing & Pages

All routes use the Next.js **App Router** (`src/app/`).

## Public routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Redirects to `/dashboard` or `/login` |
| `/login` | `app/login/page.tsx` | Login form |
| `/register` | `app/register/page.tsx` | Registration form |
| `/docs` | `app/docs/page.tsx` | Frontend documentation (this project) |
| `/unauthorized` | `app/unauthorized/page.tsx` | Access denied page |
| `404` | `app/not-found.tsx` | Page not found |

## Protected routes (`app/(app)/`)

Wrapped by `AppShell` — redirects unauthenticated users to `/login`.

| Route | Page | Primary component |
|-------|------|-------------------|
| `/dashboard` | `dashboard/page.tsx` | Parent or Tutor dashboard |
| `/cases` | `cases/page.tsx` | `CasesListView` |
| `/cases/new` | `cases/new/page.tsx` | `CaseFormView` (create) |
| `/cases/[id]` | `cases/[id]/page.tsx` | `CaseDetailView` (server fetch) |
| `/cases/[id]/edit` | `cases/[id]/edit/page.tsx` | `CaseFormView` (edit) |
| `/tutors` | `tutors/page.tsx` | `TutorsDirectoryView` |
| `/tutors/[id]` | `tutors/[id]/page.tsx` | `TutorProfileDetailView` (server fetch) |
| `/invitations` | `invitations/page.tsx` | `InvitedCasesView` (tutor) |
| `/profile` | `profile/page.tsx` | `ProfilePageView` |
| `/profile/edit` | `profile/edit/page.tsx` | `ProfileEditView` |

## Navigation by role

**Parent sidebar:** Dashboard → My Cases → Tutor Directory → Profile

**Tutor sidebar:** Dashboard → Browse Cases → Invited Cases → My Profile

## Server data fetching

Detail pages fetch on the server and pass data to client views:

```tsx
// app/(app)/cases/[id]/page.tsx
const caseData = getCaseById(id);
if (!caseData) notFound();
return <CaseDetailView caseData={caseData} />;
```
