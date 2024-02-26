import { CronJob } from 'cron';
import scrapingScript from '../scripts/scraping';
import { logger } from '../utils/logger';

export const startCronJob = () =>
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
