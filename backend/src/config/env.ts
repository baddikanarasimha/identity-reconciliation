import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  allowedOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMax: number;
  logLevel: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

const config: Config = {
  port: parseInt(getEnvVar('PORT', '5000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  databaseUrl: getEnvVar('DATABASE_URL'),
  allowedOrigins: getEnvVar('ALLOWED_ORIGINS', 'http://localhost:3000').split(',').map(s => s.trim()),
  rateLimitWindowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  rateLimitMax: parseInt(getEnvVar('RATE_LIMIT_MAX', '100'), 10),
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
};

export default config;
