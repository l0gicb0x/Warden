-- ==============================================================================
-- PHASE 2: SUPABASE SQL SCHEMA
-- ==============================================================================

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.runs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  target_url text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('shielded', 'unshielded')),
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'blocked')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  outcome text -- Free-text summary of how the run ended
);

CREATE TABLE IF NOT EXISTS public.run_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id uuid NOT NULL,
  step_number integer NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('action_attempted', 'trap_detected', 'action_blocked', 'action_rerouted', 'action_executed')),
  trap_category text, -- Nullable, populated if a trap is detected
  detail jsonb, -- Arbitrary payload (e.g., simplified DOM snapshot, Groq response)
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- Foreign Key: CASCADE because if a run is deleted, its events have no meaning and should be purged to save space.
  CONSTRAINT fk_run FOREIGN KEY (run_id) REFERENCES public.runs(id) ON DELETE CASCADE
);

-- 2. Indexes
-- We will frequently query events for a specific run, often ordered by step_number.
CREATE INDEX IF NOT EXISTS idx_run_events_run_id_step ON public.run_events(run_id, step_number);

-- 3. Row Level Security (RLS)
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.run_events ENABLE ROW LEVEL SECURITY;

-- For this hackathon demo, we allow authenticated users to read/insert. 
-- Since we are using service role keys on the backend (which bypass RLS),
-- the client (using anon key) needs read access to see real-time events.
-- We'll allow public reads to make the demo simple, or authenticated reads if auth is set up.
-- Given it's a demo without explicit user login mentioned in the spec, we'll use anon read access.
CREATE POLICY "Enable read access for all users" ON public.runs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.run_events FOR SELECT USING (true);

-- Allow backend service role to bypass RLS entirely (default behavior of service_role key), 
-- so no explicit INSERT/UPDATE policies are needed for the backend.

-- 4. Realtime Publication
-- Supabase requires tables to be explicitly added to the 'supabase_realtime' publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.run_events;

-- (No seed data included as per rules)
