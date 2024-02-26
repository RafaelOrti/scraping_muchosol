import amqplib from 'amqplib';
import { MESSAGE_BROKER_URL, EXCHANGE_NAME, DOCKER_INIT } from '../config';
import { logger } from '../utils/logger';

export const createChannel = async () => {
  if (DOCKER_INIT) {
    try {
      const connection = await amqplib.connect(MESSAGE_BROKER_URL);
      const channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
      return 'channel';
    } catch (err) {
      logger.error('Error creating channel:', err);
      throw err;
    }
  } else {
    logger.info('Dev: Simulating sending message to other services');
  }
};

export const publishMessage = async (channel, binding_key, message) => {
  if (DOCKER_INIT) {
    try {
      logger.info('Sending message to other services');
      await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (err) {
      logger.error('Error sending message:', err);
      throw err;
    }
  } else {
    logger.info('Dev: Simulating sending message to other services');
  }
};

export const subscribeMessage = async (channel, service, binding_key) => {
  if (DOCKER_INIT) {
    const appQueue = await channel.assertQueue('QUEUE_NAME');

    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);

    channel.consume(appQueue.queue, data => {
      logger.info('Received data:');
      logger.info(data.content.toString());
      channel.ack(data);
    });
  } else {
    logger.info('Dev: Simulating subscription to other services');
  }
};
