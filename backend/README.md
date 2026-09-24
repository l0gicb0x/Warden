# Warden Backend Service

This is the backend service for Warden. It is NOT a CRUD API — Supabase handles all data access directly from the frontend. This backend exists only to hide secret keys, call the Groq API, run heavy computation, and receive webhooks.

## Architectural Rules

1. **Controllers (`src/controllers/`)**: Handle HTTP only. They read `req`, call exactly ONE service function, and respond via `ApiResponse`. They **never** import a database client, the Groq SDK, or Playwright directly.
2. **Services (`src/services/`)**: Contain ALL business logic. They take plain arguments, return plain data, never reference `req` or `res`, and throw `ApiError` on failure.
3. **Routes (`src/routes/`)**: Declare only path + middleware + controller reference.
4. **Middlewares (`src/middlewares/`)**: `error.middleware.js` is the **only** file that formats an error response.
5. **Configuration (`src/config/`)**: `env.js` reads `process.env` exactly once, validates it, and exports a frozen object. No other file reads `process.env`.
6. **AI Task Execution**: Prompts are not hardcoded in controllers. `routes/ai.routes.js` accepts `POST /ai/:task` and looks up allowed tasks in a registry.
