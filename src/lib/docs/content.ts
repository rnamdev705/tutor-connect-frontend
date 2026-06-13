/**
 * Structured documentation content for the `/docs` page.
 * Markdown copies live in the repo `docs/` folder for offline/GitHub review.
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
      "This prototype uses mock data in lib/mock-data.ts with selectors in lib/data.ts. Auth is client-side via React Context and localStorage.",
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Layers, patterns, and folder structure",
    content: [
      "Feature-based components: cases/, tutors/, profile/, dashboard/, auth/, layout/, modals/, common/.",
      "Server components on detail routes (/cases/[id], /tutors/[id]) fetch data and pass props to client views.",
      "Client components handle forms, modals, filters, and auth. AppShell protects all (app) routes.",
      "Conditional UI uses react-if (<If>, <Then>, <Else>, <When>) for readable branching.",
      "Shared UI: EmptyState, ErrorState, StatusBadge, SearchInput, PageHeader, StatCard.",
    ],
  },
  {
    id: "routing",
    title: "Routing",
    description: "Public vs protected routes",
    content: [
      "Public: /login, /register, /docs, /unauthorized, 404.",
      "Protected (AppShell): /dashboard, /cases, /cases/new, /cases/[id], /cases/[id]/edit, /tutors, /tutors/[id], /invitations, /profile, /profile/edit.",
      "Parent nav: Dashboard, My Cases, Tutor Directory, Profile.",
      "Tutor nav: Dashboard, Invited Cases, My Profile.",
    ],
  },
  {
    id: "components",
    title: "Components",
    description: "Key views and shared primitives",
    content: [
      "Cases: CasesListView, CaseDetailView, CaseFormView, InvitedCasesView, CasesTable.",
      "Tutors: TutorsDirectoryView, TutorCard, TutorProfileDetailView.",
      "Profile: ProfilePageView → ParentProfileView | TutorProfileView, ProfileEditView.",
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
      "auth-store.ts validates credentials; demo users + localStorage registrations.",
      "AppShell redirects unauthenticated users to /login.",
      "Feature gates: canManage (parent + case owner), showInvite (parent on tutor profile), useCurrentTutor() for tutor flows.",
      "Register validation: Zod schema in lib/validations/auth.ts (password strength, email, role).",
    ],
  },
  {
    id: "data",
    title: "Data layer",
    description: "Mock data, selectors, and hooks",
    content: [
      "lib/data.ts: getCaseById, getTutorByUserId, getCasesByOwnerId, getParentCaseStats, getInvitationsForTutor, getTutorDashboardStats.",
      "lib/types.ts: User, Case, TutorProfile, CaseInvitation, Document, CaseStatus.",
      "useCurrentTutor() links authenticated tutor user to TutorProfile via userId.",
      "Upload limits in lib/constants.ts: PDF/DOC/DOCX/PNG/JPEG, max 10MB — enforced in UploadDocumentModal.",
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    description: "Run locally and demo accounts",
    content: [
      "cd tuition-marketplace && npm install && npm run dev",
      "Open http://localhost:3000 — login required for app routes.",
      "Documentation: http://localhost:3000/docs (this page).",
      "Demo parent: sarah@example.com / Password1",
      "Demo tutor: james@example.com / Password1",
      "Full markdown docs: docs/ folder in the repository root.",
    ],
  },
];

export const TECH_STACK = [
  { name: "Next.js 16", detail: "App Router, server + client components" },
  { name: "React 19", detail: "UI library" },
  { name: "TypeScript", detail: "Strict typing across lib/ and components/" },
  { name: "Tailwind CSS v4", detail: "Utility-first styling" },
  { name: "shadcn/ui", detail: "Accessible component primitives" },
  { name: "Zod + react-hook-form", detail: "Auth form validation" },
  { name: "react-if", detail: "Declarative conditional rendering" },
  { name: "sonner", detail: "Toast notifications" },
];
