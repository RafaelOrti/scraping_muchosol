import { Router } from 'express';
import { EventController } from '../controllers/event';
import { CreateEventDto, GetEventsDto } from '../dtos/event';
import { ValidationMiddleware } from '../middlewares/validation';

export class EventRoute {
  public path = '/events';
  public router = Router();
  public eventController = new EventController();

  constructor() {
    this.router.get(`${this.path}`, ValidationMiddleware(GetEventsDto), this.eventController.getEvents);
    this.router.get(`${this.path}/:date`, ValidationMiddleware(GetEventsDto), this.eventController.getEventsByDate);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateEventDto), this.eventController.createEvent);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateEventDto, true), this.eventController.updateEvent);
    this.router.delete(`${this.path}/:id`, this.eventController.deleteEvent);
  }
}
