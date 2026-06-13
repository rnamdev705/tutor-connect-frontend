# Components

## Layout

| Component | Path | Purpose |
|-----------|------|---------|
| `AppShell` | `layout/app-shell.tsx` | Auth guard, sidebar + top nav wrapper |
| `AppSidebar` | `layout/app-sidebar.tsx` | Role-based navigation |
| `AppTopNav` | `layout/app-top-nav.tsx` | Search, notifications, profile menu |

## Shared (`common/`)

| Component | Purpose |
|-----------|---------|
| `EmptyState` | Consistent empty lists (compact + default variants) |
| `ErrorState` | Error / not-found messaging with retry or link action |
| `StatusBadge` | Unified pill for case + invitation statuses |
| `SearchInput` | Search field with icon |
| `PageHeader` | Page title, description, count, actions slot |
| `StatCard` | Dashboard metric cards |
| `UserAvatar` | Initials avatar with size variants |

## Feature views

### Cases (`cases/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `CasesListView` | `/cases` | Parent: my cases. Tutor: browse all |
| `CaseDetailView` | `/cases/[id]` | Overview, invited tutors, documents |
| `CaseFormView` | `/cases/new`, `/cases/[id]/edit` | Create/edit case + document upload |
| `InvitedCasesView` | `/invitations` | Tutor invitation inbox |
| `CasesTable` | — | Reusable compact cases table |

### Tutors (`tutors/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `TutorsDirectoryView` | `/tutors` | Searchable tutor grid |
| `TutorCard` | — | Tutor summary card (server component) |
| `TutorProfileDetailView` | `/tutors/[id]` | Full tutor profile + invite action |

### Profile (`profile/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `ProfilePageView` | `/profile` | Routes to parent or tutor view |
| `ParentProfileView` | — | Parent stats, cases, quick links |
| `TutorProfileView` | — | Qualifications, experience, documents |
| `ProfileEditView` | `/profile/edit` | Edit account (tutor fields when applicable) |

### Dashboard (`dashboard/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `ParentDashboard` | `/dashboard` | Parent stats + recent cases |
| `TutorDashboard` | `/dashboard` | Tutor stats + quick actions |

## Modals (`modals/`)

| Component | Purpose |
|-----------|---------|
| `InviteTutorModal` | Search and invite tutor to a case |
| `UploadDocumentModal` | Drag-and-drop upload with validation |
| `DeleteConfirmationModal` | Confirm destructive actions |

## Auth (`auth/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `LoginForm` | `/login` | Zod-validated login |
| `RegisterForm` | `/register` | Zod-validated registration |
| `AuthBrandingPanel` | `/login`, `/register` | Shared branding side panel |

## Conditional rendering pattern

```tsx
import { If, Then, Else, When } from "react-if";

<If condition={items.length === 0}>
  <Then><EmptyState ... /></Then>
  <Else><ItemsList items={items} /></Else>
</If>

<When condition={canEdit}>
  <Button>Edit</Button>
</When>
```
