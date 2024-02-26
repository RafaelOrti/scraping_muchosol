import { Router } from 'express';
import { eventController } from '../controllers/event';
import { createEventDto, GetEventsDto } from '../dtos/event';
import { ValidationMiddleware } from '../middlewares/validation';

export class EventRoute {
  public path = '/Events';
  public router = Router();
  public eventController = new eventController();

  constructor() {
    this.router.get(`${this.path}`, ValidationMiddleware(GetEventsDto), this.eventController.getEvents);
    this.router.get(`${this.path}/:date`, ValidationMiddleware(GetEventsDto), this.eventController.getEventsByDate);
    this.router.post(`${this.path}`, ValidationMiddleware(createEventDto), this.eventController.createEvent);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(createEventDto, true), this.eventController.updateEvent);
    this.router.delete(`${this.path}/:id`, this.eventController.deleteEvent);
  }
}
