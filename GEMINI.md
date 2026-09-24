# Project Rules

Antigravity loads this file automatically before every task. These rules are
non-negotiable and apply to every generation, in every file, by either
teammate, for the whole event.

## Non-negotiable backend architecture

- Controllers (backend/src/controllers/) never import a database client, the
  Groq SDK, or Playwright directly. A controller reads req, calls exactly one
  service function, and responds via ApiResponse.
- Services (backend/src/services/) contain ALL business logic. They take
  plain arguments, return plain data, never reference req or res, and throw
  ApiError on failure.
- Routes declare only path + middleware + controller reference.
- error.middleware.js is the only file that formats an error response.
- trap-detection.service.js is deterministic and rule-based. It never calls
  Groq or any LLM — its output must be reproducible given the same input,
  every time, including live in front of judges.

## Frontend data access

- Feature code imports ONLY db from src/lib/dataProvider.js. Never import
  axios, supabase-js, or either provider file directly from a feature.
- The Live Interception Console and Side-by-Side Run view are hand-built,
  not generated via the build-feature-module skill — they don't fit the
  list/detail CRUD shape that skill assumes.
- Never hard-code a colour. All colour comes from the six tokens in
  src/styles/theme.css.

## Vendor boundaries — do not edit these directories

- src/components/ui/
- src/components/aceternity/
- src/components/magicui/

## Working style — human-in-the-loop is mandatory

- Generate ONE file per turn for anything under services/, controllers/,
  hooks/, or components/. Stop and wait for explicit approval before
  continuing.
- Config, boilerplate, and folder scaffolding (package.json, vite.config.js,
  empty stub files) can be reviewed quickly and don't need the same
  file-by-file pausing — but never batch anything from services/ or
  controllers/.
- State any assumption made in the file just generated.
- Never modify a file outside the one currently under review.

## Stack specifics

- Tailwind is pinned to 3.4.17. Never upgrade it to v4.
- Groq calls happen only in backend/src/services/groq.service.js. The key
  never appears in frontend code, ever.

---

## Current project

- Product: Warden
- Track: AI Bodyguard — Autonomous Agent Shield
- Core entities: runs (Supabase, realtime), run_events (Supabase, realtime),
  trap-page fixtures (static, served from Node)
- Path per entity: runs / run_events -> Supabase. Agent loop, trap detection
  engine, and all Groq calls -> Node.
- The one AI feature: Groq decides the next action for the agent under test.
  Optional second call explains a detected trap in one plain-English sentence.