import { CronJob } from 'cron';
import { App } from './app';
import { ValidateEnv } from './utils/validateEnv';
import scrapingScript from './scripts/scraping';
import { logger } from './utils/logger';

ValidateEnv();

const server = new App();

server.listen();

new CronJob(
  '* * * * *',
  () => {
    try {
      logger.info('Initializing cron');
      scrapingScript.start();
    } catch (error) {
      logger.error('An error occurred:', error);
    }
  },
  null,
  true,
  'Europe/Madrid',
);
