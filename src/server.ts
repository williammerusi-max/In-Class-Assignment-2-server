import { app } from './app.js';
import { verifyDatabaseConnection } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const startServer = async (): Promise<void> => {
  await verifyDatabaseConnection();

  app.listen(env.port, () => {
    logger.info('Server started successfully', { port: env.port });
  });
};

void startServer().catch((error: Error) => {
  logger.error('Failed to start server', { message: error.message, stack: error.stack });
  process.exit(1);
});
