# TutorConnect — Tuition Marketplace

A modern SaaS-style tuition marketplace built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a demo role (Parent or Tutor).

## Frontend documentation (Storybook)

Component catalog and architecture notes:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) — browse **Introduction** and **Common** stories.

Static build: `npm run build-storybook` → output in `storybook-static/`.

Additional markdown docs: [`docs/`](./docs/README.md) folder.

## Features

- **Parent**: Dashboard, My Cases, Tutor Directory, Case management, Invite tutors, Upload documents
- **Tutor**: Dashboard, Invited Cases, Profile management, Document uploads
- Collapsible sidebar with role-based navigation
- Professional light-mode UI with status badges, empty/loading/error states
- Modals: Invite Tutor, Upload Document, Delete Confirmation

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide icons

## Demo Data

The app uses mock data stored in `src/lib/mock-data.ts`. Authentication is simulated via localStorage role selection on the login page.
