/**
 * Unified Data Bridge
 * -------------------
 * Every feature imports ONLY `db` from this file.
 * Never import axios, supabase-js, or either provider directly from feature code.
 *
 * Usage:
 *   import { db } from '@/lib/dataProvider';
 *
 *   // Supabase direct (runs, run_events — realtime-capable tables)
 *   const runs = await db.supabase.getList('runs', { order: { column: 'created_at', ascending: false } });
 *   const sub  = db.supabase.subscribe('run_events', handler, { filter: 'run_id=eq.abc' });
 *
 *   // REST backend (agent loop, Groq analysis, trap detection — Express routes)
 *   const result = await db.rest.post('/runs/start', { targetUrl });
 */

import { supabaseProvider } from './providers/supabaseProvider.js';
import { restProvider } from './providers/restProvider.js';

export const db = Object.freeze({
  supabase: supabaseProvider,
  rest: restProvider,
});
