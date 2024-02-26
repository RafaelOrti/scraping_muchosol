import { CronJob } from 'cron';
import scrapingScript from '../scripts/scraping';
import { logger } from '../utils/logger';

let cronJobInstance: CronJob;

export const startCronJob = () =>
  (cronJobInstance = new CronJob(
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
  ));

export const stopCronJob = () => {
  if (cronJobInstance) {
    cronJobInstance.stop();
    logger.info('CronJob stopped');
  }
};
