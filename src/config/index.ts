import { config } from 'dotenv';

config({ path: '.env' });
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const { URL_EL_MUNDO, URL_EL_PAIS } = process.env;
export const { REDIS_URL, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
