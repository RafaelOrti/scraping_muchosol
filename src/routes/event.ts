import { Router } from 'express';
import { eventController } from '../controllers/event';
import { CreateeventDto, GetEventsDto } from '../dtos/event';
import { ValidationMiddleware } from '../middlewares/validation';

export class EventRoute {
  public path = '/Events';

  public router = Router();

  public eventController = new eventController();

  constructor() {
    this.router.get(`${this.path}`, ValidationMiddleware(GetEventsDto), this.eventController.getEvents);
    this.router.get(`${this.path}/:date`, ValidationMiddleware(GetEventsDto), this.eventController.getEventsByDate);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateeventDto), this.eventController.createevent);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateeventDto, true), this.eventController.updateevent);
    this.router.delete(`${this.path}/:id`, this.eventController.deleteevent);
  }
}
