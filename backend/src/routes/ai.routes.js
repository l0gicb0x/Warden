import { Router } from 'express';
import { handleAiTask } from '../controllers/ai.controller.js';
import { validateAiRequest } from '../validators/ai.validator.js';
import { apiRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/v1/ai/:task
router.post('/:task', apiRateLimiter, requireAuth, validateAiRequest, handleAiTask);

export default router;
