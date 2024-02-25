import { config } from 'dotenv';

config({ path: '.env' });

export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, DB_HOST, DB_PORT, DB_DATABASE, URL_EL_MUNDO, URL_EL_PAIS } = process.env;
