"use client";

import Link from "next/link";
import { BookOpen, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DOC_SECTIONS, TECH_STACK } from "@/lib/docs/content";
import { APP_NAME } from "@/lib/constants";

export function DocsPageView() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">{APP_NAME} Docs</p>
              <p className="text-xs text-muted-foreground">Frontend architecture & components</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">Open app</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10">
          <Badge variant="secondary" className="mb-3">
            Frontend documentation
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            Architecture & component guide
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            This page documents the TutorConnect frontend: routing, components, auth,
            data layer, and conventions. Markdown sources are in the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">docs/</code>{" "}
            folder at the repo root.
          </p>
        </div>

        <Card className="mb-10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tech stack</CardTitle>
            <CardDescription>Libraries and tools used in this project</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              {TECH_STACK.map((item) => (
                <div key={item.name} className="rounded-lg border bg-background p-3">
                  <dt className="text-sm font-medium">{item.name}</dt>
                  <dd className="mt-0.5 text-xs text-muted-foreground">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {DOC_SECTIONS.map((section) => (
            <Card key={section.id} id={section.id} className="scroll-mt-6 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((line) => (
                    <li key={line} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Repository markdown docs
            </CardTitle>
            <CardDescription>
              Detailed write-ups for reviewers reading the codebase on GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "docs/README.md",
                "docs/getting-started.md",
                "docs/architecture.md",
                "docs/components.md",
                "docs/routing.md",
                "docs/auth-and-access-control.md",
                "docs/data-layer.md",
              ].map((path) => (
                <li
                  key={path}
                  className="rounded-md border bg-background px-3 py-2 font-mono text-xs text-muted-foreground"
                >
                  {path}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
              TSDoc comments on key modules: auth-context, auth-store, data, validations, hooks
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
