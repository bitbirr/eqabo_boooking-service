import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'DATABASE_URL'];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const config = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;