# Getting Started

## Prerequisites

- Node.js 20+
- npm

## Install & run

```bash
cd tuition-marketplace
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

Documentation UI: [http://localhost:3000/docs](http://localhost:3000/docs)

Storybook (component catalog): `npm run storybook` → [http://localhost:6006](http://localhost:6006)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## Project structure

```
src/
├── app/              # Next.js routes (App Router)
├── components/       # Feature & shared UI components
│   ├── auth/
│   ├── cases/
│   ├── common/
│   ├── dashboard/
│   ├── docs/
│   ├── layout/
│   ├── modals/
│   ├── profile/
│   ├── providers/
│   └── tutors/
└── lib/                # Types, data access, auth, validations
    ├── hooks/
    └── validations/
docs/                   # Markdown documentation (this folder)
```
