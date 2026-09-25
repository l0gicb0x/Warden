import app from './app.js';
import { env } from './config/env.js';

const startServer = () => {
  try {
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Warden Backend running on port ${env.PORT} in ${env.NODE_ENV} mode [model: ${env.GROQ_MODEL}]`);
    });

    // Handle graceful shutdown
    const shutdown = () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        console.log('Closed out remaining connections.');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
