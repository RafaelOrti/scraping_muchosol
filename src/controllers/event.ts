import { NextFunction, Request, Response } from 'express';
import { Event } from '../interfaces/event';
import { EventService } from '../services/event';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  /**
   * Get all events.
   * @route GET /events
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing an array of events and a message.
   */
  public getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip, limit } = req.body;
      const findAllEventsData: Event[] = await this.eventService.findAllEvents(skip, limit);
      res.status(200).json({ data: findAllEventsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get events by date.
   * @route GET /events/:date
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing an array of events filtered by date and a message.
   */
  public getEventsByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date: Date = new Date(req.params.date);
      const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));

      const skip: number = parseInt(req.query.skip as string, 10);
      const limit: number = parseInt(req.query.limit as string, 10);
      const filteredByDateEventsData: Event[] = await this.eventService.findEventsByDate(startOfDay, endOfDay, skip, limit);
      res.status(200).json({ data: filteredByDateEventsData, message: 'filteredByDate' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new event.
   * @route POST /events
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the created event and a message.
   */
  public createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventData: Event = req.body;
      const createEventData: Event = await this.eventService.createEvent(eventData);
      res.status(201).json({ data: createEventData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a event by ID.
   * @route PUT /events/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the updated event and a message.
   */
  public updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId: string = req.params.id;
      const EventData: Event = req.body;
      const updateEventData: Event = await this.eventService.updateEvent(eventId, EventData);
      res.status(200).json({ data: updateEventData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a event by ID.
   * @route DELETE /events/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the deleted event and a message.
   */
  public deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId: string = req.params.id;
      const deleteEventData: Event = await this.eventService.deleteEvent(eventId);
      res.status(200).json({ data: deleteEventData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
