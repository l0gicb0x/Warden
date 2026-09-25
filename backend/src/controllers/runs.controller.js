import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { supabase } from '../config/supabase.js';
import { runAgent } from '../services/agent-runner.service.js';
import { z } from 'zod';

const CreateRunSchema = z.object({
  target_url: z.string().url(),
  mode: z.enum(['shielded', 'unshielded']),
  goal: z.string().optional()
});

export const startRun = asyncHandler(async (req, res) => {
  const validated = CreateRunSchema.safeParse(req.body);
  if (!validated.success) {
    throw new ApiError(400, "Invalid payload", validated.error.errors);
  }

  const { target_url, mode, goal } = validated.data;

  // 1. Create run row
  const { data: run, error } = await supabase
    .from('runs')
    .insert([{ target_url, mode }])
    .select('id')
    .single();

  if (error || !run) {
    throw new ApiError(500, "Failed to create run in database", [error?.message]);
  }

  // 2. Async start agent (do not await to avoid blocking the response)
  runAgent(run.id, target_url, mode, goal).catch(err => {
    console.error(`Agent run ${run.id} crashed:`, err);
  });

  // 3. Return 202 Accepted immediately
  res.status(202).json(new ApiResponse(202, { id: run.id }, 'Run started asynchronously'));
});

export const getRunEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: events, error } = await supabase
    .from('run_events')
    .select('*')
    .eq('run_id', id)
    .order('step_number', { ascending: true });

  if (error) {
    throw new ApiError(500, "Failed to fetch run events", [error.message]);
  }

  res.status(200).json(new ApiResponse(200, events, 'Run events retrieved successfully'));
});
