import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// WARNING: This client uses the SERVICE ROLE key.
// This key bypasses Row Level Security (RLS) entirely!
// It must NEVER reach the browser or be exposed to the client in any way.
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
