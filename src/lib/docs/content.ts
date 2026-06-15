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
      "TutorConnect is a role-based tutoring marketplace: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.",
      "Parents create tutoring cases, invite tutors, and upload documents. Tutors manage invitations and maintain a profile.",
      "The frontend connects to tutorConnect-api via an OpenAPI-generated client (src/api/). TanStack Query handles caching, server-side pagination, and mutations.",
      "Monorepo layout: tutorConnect-api/ (Express + Prisma) and tuition-marketplace/ (this app).",
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Layers, patterns, and folder structure",
    content: [
      "Feature-based components: cases/, tutors/, profile/, dashboard/, auth/, layout/, modals/, common/.",
      "Route pages are thin wrappers; *View components own UI and data fetching.",
      "lib/queries/ — React Query options, invalidation, and cache patch helpers.",
      "lib/hooks/ — pending-action hooks for optimistic UX (invites, uploads, deletes, accept/decline).",
      "src/proxy.ts — Next.js 16 route protection (replaces deprecated middleware.ts).",
      "Shared UI: EmptyState, ErrorState, StatusBadge, ListFilterToolbar, PageHeader, StatCard.",
    ],
  },
  {
    id: "routing",
    title: "Routing",
    description: "Public vs protected routes",
    content: [
      "Public: /login, /register, /docs, /unauthorized.",
      "Protected (proxy + AppShell): /dashboard, /cases, /tutors, /invitations, /profile.",
      "Parent nav: Dashboard, My Cases, Tutor Directory, Profile.",
      "Tutor nav: Dashboard, Invited Cases, My Profile.",
      "TutorProfileGate redirects incomplete tutor profiles to /profile/edit.",
    ],
  },
  {
    id: "components",
    title: "Components",
    description: "Key views and shared primitives",
    content: [
      "Cases: CasesListView, CaseDetailView (+ section cards), CaseFormView, CaseDocumentsView, InvitedCasesView.",
      "Tutors: TutorsDirectoryView, TutorCard, TutorProfileDetailView.",
      "Profile: ProfilePageView, ProfileEditView, TutorProfileGate.",
      "Modals: InviteTutorModal (server search), UploadDocumentModal, DeleteConfirmationModal, DocumentPreviewModal.",
      "Auth: LoginForm, RegisterForm (Zod + react-hook-form, real API).",
    ],
  },
  {
    id: "auth",
    title: "Auth & access control",
    description: "Session, validation, and role checks",
    content: [
      "AuthProvider (lib/auth-context.tsx) exposes useAuth(): user, login, register, logout.",
      "JWT stored in localStorage; mirrored to a cookie (tutorconnect-token) for Next.js proxy route protection.",
      "AppShell redirects unauthenticated users; proxy guards protected routes on first load.",
      "api-error.ts sanitizes internal server/Prisma errors before showing them in the UI.",
      "Register validation: Zod schema in lib/validations/auth.ts.",
    ],
  },
  {
    id: "data",
    title: "Data layer",
    description: "API client, queries, and cache",
    content: [
      "Generated types and SDK: src/api/types.gen.ts, sdk.gen.ts, @tanstack/react-query.gen.ts — regenerate with npm run generate:api.",
      "List endpoints use server-side page, limit, search, and filter query params (debounced 300 ms).",
      "invalidate.ts — predicate-based cache invalidation by query key id.",
      "useCaseInvitationMutations — shared invite/revoke logic for case detail views.",
      "Upload limits in lib/constants.ts: PDF/DOCX/PNG/JPEG, max 10 MB.",
      "Env: NEXT_PUBLIC_API_URL (default http://localhost:3001/api/v1).",
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    description: "Run locally",
    content: [
      "Start API: cd tutorConnect-api && npm install && cp .env.example .env && npm run db:migrate && npm run db:seed && npm run dev",
      "Start frontend: cd tuition-marketplace && npm install && cp .env.example .env.local && npm run dev",
      "Open http://localhost:3000 — demo login: sarah@example.com / Password1 (parent) or james@example.com / Password1 (tutor).",
      "API docs: http://localhost:3001/api-docs",
      "Regenerate client after API changes: npm run generate:api",
      "Markdown docs: tuition-marketplace/docs/ · Storybook: npm run storybook",
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Production checklist",
    content: [
      "API (e.g. Render): set DATABASE_URL (Neon pooled), DIRECT_URL, JWT_SECRET, CORS_ORIGINS. Build runs postinstall (prisma generate + tsc).",
      "Frontend: set NEXT_PUBLIC_API_URL to your API base including /api/v1.",
      "Add the frontend origin to API CORS_ORIGINS.",
      "Neon free tier: DB sleeps after ~5 min idle. API keep-alive pings every 4 min while running; use GET /health/ready on a cron if the API also sleeps.",
      "Health checks: GET /health (liveness), GET /health/ready (DB ping).",
    ],
  },
];

export const TECH_STACK = [
  { name: "Next.js 16", detail: "App Router, proxy.ts, server/client components" },
  { name: "React 19", detail: "UI with hooks and TanStack Query v5" },
  { name: "TypeScript", detail: "Strict typing with OpenAPI-generated API types" },
  { name: "TanStack Query v5", detail: "Server-side pagination, cache, mutations" },
  { name: "Tailwind CSS v4", detail: "Utility-first styling" },
  { name: "shadcn/ui", detail: "Accessible component primitives" },
  { name: "Zod + react-hook-form", detail: "Auth form validation" },
  { name: "OpenAPI client", detail: "Generated SDK from tutorConnect-api spec" },
  { name: "Express + Prisma API", detail: "JWT auth, Neon PostgreSQL, Swagger at /api-docs" },
];
