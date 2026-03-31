import fs from 'node:fs';
import path from 'node:path';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

const logsDirectory = path.resolve(process.cwd(), 'logs');
const logFilePath = path.join(logsDirectory, 'server.log');

const ensureLogFile = (): void => {
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
  }

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
  }
};

const serializeMetadata = (metadata?: Record<string, unknown>): string => {
  if (!metadata) {
    return '';
  }

  return ` ${JSON.stringify(metadata)}`;
};

const writeLog = (level: LogLevel, message: string, metadata?: Record<string, unknown>): void => {
  ensureLogFile();

  const entry = `${new Date().toISOString()} [${level}] ${message}${serializeMetadata(metadata)}\n`;

  fs.appendFileSync(logFilePath, entry, 'utf-8');
  process.stdout.write(entry);
};

export const logger = {
  info: (message: string, metadata?: Record<string, unknown>): void => {
    writeLog('INFO', message, metadata);
  },
  warn: (message: string, metadata?: Record<string, unknown>): void => {
    writeLog('WARN', message, metadata);
  },
  error: (message: string, metadata?: Record<string, unknown>): void => {
    writeLog('ERROR', message, metadata);
  },
};
