import { config } from 'dotenv';

config({ path: '.env' });

export const {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  LOG_DIR,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  EVENTS_BINDING_KEY,
  DOCKER_INIT,
} = process.env;
