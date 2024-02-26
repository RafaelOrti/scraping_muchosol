import request, { Response } from 'supertest';
import { App } from '../app';
import { EventRoute } from '../routes/event';
import mongoose from 'mongoose';

let createdEventId: string;

const app = new App().getServer();
const eventsRoute = new EventRoute();

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await mongoose.disconnect();
});

describe('Event Routes', () => {
  it('should get all events', async () => {
    try {
      const response: Response = await request(app).get(`${eventsRoute.path}`);
      expect(response.status).toBe(200);
    } catch (error) {
      throw error;
    }
  });

  it('should get events by date', async () => {
    try {
      const date = '2024-02-26';
      const response: Response = await request(app).get(`/events/${date}`);
      expect(response.status).toBe(200);
    } catch (error) {
      throw error;
    }
  });

  it('should create a new event', async () => {
    try {
      const eventData = { heading: 'Test Event', date: '2024-02-26', provider: 'Test Provider' };
      const response: Response = await request(app).post('/events').send(eventData);
      expect(response.status).toBe(201);
      createdEventId = response.body.data._id;
    } catch (error) {
      throw error;
    }
  });

  it('should update an event', async () => {
    try {
      const eventData = { heading: 'Updated Test Event' };
      const response: Response = await request(app).put(`/events/${createdEventId}`).send(eventData);
      expect(response.status).toBe(200);
    } catch (error) {
      throw error;
    }
  });

  it('should delete an event', async () => {
    try {
      const response: Response = await request(app).delete(`/events/${createdEventId}`);
      expect(response.status).toBe(200);
    } catch (error) {
      throw error;
    }
  });
});
