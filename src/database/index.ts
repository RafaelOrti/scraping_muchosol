import mongoose, { set } from 'mongoose';
import { NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE } from '../config';
import { logger } from '../utils/logger';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  };

  logger.info('Database configuration:', dbConfig);

  mongoose.set('strictQuery', false);

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  try {
    await mongoose.connect(dbConfig.url);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
  }
};
