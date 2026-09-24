import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { complete } from '../services/groq.service.js';
import { getNextActionPrompt, getTrapExplanationPrompt } from '../services/prompt.service.js';

/**
 * Registry of allowed tasks mapping to their prompt functions and expected format
 */
const TASK_REGISTRY = {
  'next-action': {
    getPrompt: (data) => getNextActionPrompt(data?.agentState, data?.allowedActions),
    json: true,
  },
  'explain-trap': {
    getPrompt: (data) => getTrapExplanationPrompt(data?.trapData),
    json: false,
  },
};

export const handleAiTask = asyncHandler(async (req, res) => {
  const { task } = req.params;
  const data = req.validatedBody?.data || req.body;

  // 1. Look up the task in the registry
  const taskConfig = TASK_REGISTRY[task];
  if (!taskConfig) {
    throw new ApiError(404, `Task '${task}' is not recognized.`);
  }

  // 2. Generate the prompt using the service
  const { system, user } = taskConfig.getPrompt(data);

  // 3. Call the Groq service
  const result = await complete({
    system,
    user,
    json: taskConfig.json,
  });

  // 4. Respond with ApiResponse
  res.status(200).json(new ApiResponse(200, result, 'AI task completed successfully'));
});
