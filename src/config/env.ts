import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'AUTH_TOKEN_SECRET',
] as const;

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  authTokenSecret: process.env.AUTH_TOKEN_SECRET as string,
} as const;
