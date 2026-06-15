# Components

## Layout

| Component | Path | Purpose |
|-----------|------|---------|
| `AppShell` | `layout/app-shell.tsx` | Auth guard, sidebar + top nav wrapper |
| `AppSidebar` | `layout/app-sidebar.tsx` | Role-based navigation |
| `AppTopNav` | `layout/app-top-nav.tsx` | Profile menu, logout |
| `TutorProfileGate` | `layout/tutor-profile-gate.tsx` | Blocks incomplete tutor profiles |

## Shared (`common/`)

| Component | Purpose |
|-----------|---------|
| `EmptyState` | Consistent empty lists (compact + default variants) |
| `ErrorState` | Error messaging with retry or link action |
| `StatusBadge` | Unified pill for case + invitation statuses |
| `ListFilterToolbar` | Debounced search + filters synced to URL |
| `PageHeader` | Page title, description, count, actions slot |
| `StatCard` | Dashboard metric cards |
| `UserAvatar` | Initials avatar with size variants |

## Feature views

### Cases (`cases/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `CasesListView` | `/cases` | Paginated cases with search/filters |
| `CaseDetailView` | `/cases/[id]` | Overview + section cards (invited tutors, documents) |
| `CaseFormView` | `/cases/new`, `/cases/[id]/edit` | Create/edit case |
| `CaseDocumentsView` | `/cases/[id]/documents` | Document management |
| `InvitedCasesView` | `/invitations` | Tutor invitation inbox |
| `case-detail-invited-tutors-card.tsx` | — | Invited tutors section |
| `case-detail-documents-card.tsx` | — | Documents section |

### Tutors (`tutors/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `TutorsDirectoryView` | `/tutors` | Paginated, searchable tutor grid |
| `TutorCard` | — | Tutor summary card |
| `TutorProfileDetailView` | `/tutors/[id]` | Full profile + invite action |

### Profile (`profile/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `ProfilePageView` | `/profile` | Routes to parent or tutor view |
| `ParentProfileView` | — | Parent stats and quick links |
| `TutorProfileView` | — | Qualifications, experience, documents |
| `ProfileEditView` | `/profile/edit` | Edit account and tutor profile fields |

### Dashboard (`dashboard/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `ParentDashboard` | `/dashboard` | Parent stats + recent cases |
| `TutorDashboard` | `/dashboard` | Tutor stats + quick actions |

## Modals (`modals/`)

| Component | Purpose |
|-----------|---------|
| `InviteTutorModal` | Server-side tutor search + invite |
| `UploadDocumentModal` | Drag-and-drop upload with validation |
| `DeleteConfirmationModal` | Confirm destructive actions |
| `DocumentPreviewModal` | In-browser document preview |

## Auth (`auth/`)

| Component | Route | Description |
|-----------|-------|-------------|
| `LoginForm` | `/login` | Zod-validated login via API |
| `RegisterForm` | `/register` | Zod-validated registration |
| `AuthBrandingPanel` | `/login`, `/register` | Shared branding side panel |

## Providers (`providers/`)

| Component | Purpose |
|-----------|---------|
| `AppProviders` | QueryClient + AuthProvider + TooltipProvider |

## Conditional rendering

Most components use plain `{condition && …}` or ternaries. Some Storybook stories use `react-if` (`<If>`, `<When>`) — not required app-wide.

```tsx
{items.length === 0 ? (
  <EmptyState title="No cases yet" />
) : (
  <CasesTable items={items} />
)}
```
