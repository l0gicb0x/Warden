import { Router } from 'express';
import { startRun, getRunEvents } from '../controllers/runs.controller.js';
import { apiRateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// POST /api/v1/runs -> Start a new run
router.post('/', apiRateLimiter, startRun);

// GET /api/v1/runs/:id/events -> Fetch events for a run
router.get('/:id/events', apiRateLimiter, getRunEvents);

export default router;
