import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { decideNextAction, explainTrap } from '../services/groq.service.js';

export const handleAiTask = asyncHandler(async (req, res) => {
  const { task } = req.params;
  const data = req.validatedBody?.data || req.body;

  let result;

  if (task === 'decide-next-action') {
    if (!data.goal || !data.simplifiedDOM) {
      throw new ApiError(400, "Missing 'goal' or 'simplifiedDOM' in request body");
    }
    result = await decideNextAction(data.goal, data.simplifiedDOM);
  } else if (task === 'explain-trap') {
    if (!data.trapEvent) {
      throw new ApiError(400, "Missing 'trapEvent' in request body");
    }
    result = await explainTrap(data.trapEvent);
  } else {
    throw new ApiError(404, `Task '${task}' is not recognized.`);
  }

  // Respond with ApiResponse
  res.status(200).json(new ApiResponse(200, result, 'AI task completed successfully'));
});
