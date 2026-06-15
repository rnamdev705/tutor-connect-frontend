/**
 * Structured documentation content for the `/docs` page.
 */

export interface DocSection {
  id: string;
  title: string;
  description: string;
  content: string[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Stack, goals, and high-level structure",
    content: [
      "TutorConnect is a role-based tutoring marketplace built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.",
      "Parents create tutoring cases, invite tutors, and upload documents. Tutors manage invitations and maintain a profile.",
      "The frontend talks to a REST API via an OpenAPI-generated client (src/api/). TanStack Query handles caching, pagination, and mutations.",
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Layers, patterns, and folder structure",
    content: [
      "Feature-based components: cases/, tutors/, profile/, dashboard/, auth/, layout/, modals/, common/.",
      "Route pages are thin wrappers; *View components own UI and data fetching.",
      "lib/queries/list-queries.ts — shared React Query options with server-side pagination.",
      "lib/hooks/ — pending-action hooks for optimistic UX (invites, uploads, deletes).",
      "Shared UI: EmptyState, ErrorState, StatusBadge, SearchInput, PageHeader, StatCard.",
    ],
  },
  {
    id: "routing",
    title: "Routing",
    description: "Public vs protected routes",
    content: [
      "Public: /login, /register, /docs, /unauthorized.",
      "Protected (middleware + AppShell): /dashboard, /cases, /tutors, /invitations, /profile.",
      "Parent nav: Dashboard, My Cases, Tutor Directory, Profile.",
      "Tutor nav: Dashboard, Invited Cases, My Profile.",
    ],
  },
  {
    id: "components",
    title: "Components",
    description: "Key views and shared primitives",
    content: [
      "Cases: CasesListView, CaseDetailView (+ section cards), CaseFormView, InvitedCasesView.",
      "Tutors: TutorsDirectoryView, TutorCard, TutorProfileDetailView.",
      "Profile: ProfilePageView, ProfileEditView, TutorProfileGate.",
      "Modals: InviteTutorModal, UploadDocumentModal, DeleteConfirmationModal.",
      "Auth: LoginForm, RegisterForm (Zod + react-hook-form).",
    ],
  },
  {
    id: "auth",
    title: "Auth & access control",
    description: "Session, validation, and role checks",
    content: [
      "AuthProvider (lib/auth-context.tsx) exposes useAuth(): user, login, register, logout.",
      "JWT stored in localStorage; mirrored to a cookie for Next.js middleware route protection.",
      "AppShell redirects unauthenticated users; middleware guards protected routes on first load.",
      "api-error.ts sanitizes internal server errors before showing them in the UI.",
      "Register validation: Zod schema in lib/validations/auth.ts.",
    ],
  },
  {
    id: "data",
    title: "Data layer",
    description: "API client, queries, and cache",
    content: [
      "Generated types and SDK: src/api/types.gen.ts, sdk.gen.ts, @tanstack/react-query.gen.ts.",
      "List endpoints use server-side page, limit, search, and filter query params.",
      "invalidate.ts — predicate-based cache invalidation by query key id.",
      "useCaseInvitationMutations — shared invite/revoke logic for case detail views.",
      "Upload limits in lib/constants.ts: PDF/DOCX/PNG/JPEG, max 10MB.",
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    description: "Run locally",
    content: [
      "Start API: cd tutorConnect-api && npm run dev",
      "Start frontend: cd tuition-marketplace && npm install && npm run dev",
      "Open http://localhost:3000 — register or log in to access the app.",
      "API docs: http://localhost:3001/api-docs",
      "Regenerate client after API changes: npm run generate:api",
    ],
  },
];

export const TECH_STACK = [
  { name: "Next.js 16", detail: "App Router, middleware, server/client components" },
  { name: "React 19", detail: "UI with hooks and TanStack Query" },
  { name: "TypeScript", detail: "Strict typing with OpenAPI-generated API types" },
  { name: "TanStack Query v5", detail: "Server-side pagination, cache, mutations" },
  { name: "Tailwind CSS v4", detail: "Utility-first styling" },
  { name: "shadcn/ui", detail: "Accessible component primitives" },
  { name: "Zod + react-hook-form", detail: "Auth form validation" },
  { name: "OpenAPI client", detail: "Generated SDK from tutorConnect-api spec" },
];
