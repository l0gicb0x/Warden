import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import aiRoutes from './routes/ai.routes.js';
import runsRoutes from './routes/runs.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

// 1. Helmet for security headers
app.use(helmet());

// 2. CORS configuration
app.use(cors({ origin: env.CORS_ORIGIN.split(',') }));

// 3. Body Parsing with raw-body branch for potential webhooks
app.use(
  express.json({
    verify: (req, res, buf) => {
      // If a route includes /webhook, attach the raw buffer
      if (req.originalUrl.includes('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

// 4. Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 5. Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 6. Serve static trap fixtures
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/traps', express.static(path.join(__dirname, '../public/traps')));

// 7. Mount API Routes
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/runs', runsRoutes);

// 7. Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 8. Global Error Middleware
app.use(errorHandler);

export default app;
