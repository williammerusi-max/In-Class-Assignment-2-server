import mysql from 'mysql2/promise';
import { env } from './env.js';
import { logger } from './logger.js';

export const db = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  connectionLimit: 10,
});

export const verifyDatabaseConnection = async (): Promise<void> => {
  const connection = await db.getConnection();
  connection.release();
  logger.info('Database connection verified successfully');
};
