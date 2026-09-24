---
name: build-feature-module
description: Use when scaffolding a new feature module (api.js, hook, card, skeleton, index.js) under src/features/. Generates one file at a time following this project's data-provider and layer conventions. Do not use for backend routes or services — that follows a separate pattern documented in the master playbook's Prompt A. Do not use for the Live Interception Console or Side-by-Side Run view — those are hand-built, not list/detail CRUD.
---

# Build Feature Module

Scaffolds a complete, convention-following feature module under
src/features/<name>/. This skill exists so the same five-file pattern
doesn't need to be re-typed as a full prompt every time a new feature starts
— invoke this skill by name, or via the /new-feature workflow.

## Before generating anything, confirm

If not already given in the request, ask for:

- Feature name (kebab-case — becomes both the folder name and the
  Supabase/Node resource name)
- The 2–4 domain verbs it needs (e.g. list, create, archive)
- Whether it needs a realtime subscription

## Build order

Generate exactly ONE file per turn. After each file, stop and wait for
explicit approval before continuing to the next item. This is not optional —
see the working-style rules in the project's GEMINI.md, which this skill
inherits and must not override.

1. src/features/<name>/api.js — domain verbs mapped onto db, imported
   from src/lib/dataProvider.js. No other import in this file.
2. src/features/<name>/hooks/use<Name>.js — owns loading/error/data state,
   returns { items, loading, error, refetch }. If realtime was requested,
   subscribe inside a useEffect and return the unsubscribe function from its
   cleanup.
3. src/features/<name>/components/<Name>Card.jsx — the single repeated
   display unit for one record.
4. src/features/<name>/components/<Name>Skeleton.jsx — a loading state
   matching the real card's dimensions, so nothing shifts on load.
5. src/features/<name>/index.js — re-exports only the public surface: the
   hook, and any components a page will import directly.

## Rules this skill must follow

- Never import axios, supabase-js, or a provider file directly — only db.
- Never touch components/ui/, components/aceternity/, components/magicui/.
- No console.log left in any generated file.
- Every async path in the hook has a real loading and error state — no
  silent failures.
- Stop after each file. Do not generate item 2 while item 1 is still
  awaiting approval, even if the next file seems obvious.