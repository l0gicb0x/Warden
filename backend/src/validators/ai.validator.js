import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validateAiRequest = (req, res, next) => {
  const schema = z.object({
    data: z.any().optional(), // Generic data payload for the task
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(new ApiError(400, 'Invalid request body', result.error.errors));
  }

  req.validatedBody = result.data;
  next();
};
