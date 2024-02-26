import { NextFunction, Request, Response } from 'express';
import { event } from '../interfaces/event';
import { Eventservice } from '../services/event';

export class eventController {
  private Eventservice: Eventservice;

  constructor() {
    this.Eventservice = new Eventservice();
  }

  /**
   * Get all Events.
   * @route GET /Events
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing an array of Events and a message.
   */
  public getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip, limit } = req.body;
      const findAllEventsData: event[] = await this.Eventservice.findAllEvents(skip, limit);
      res.status(200).json({ data: findAllEventsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get Events by date.
   * @route GET /Events/:date
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing an array of Events filtered by date and a message.
   */
  public getEventsByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date: Date = new Date(req.params.date);
      const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));

      const skip: number = parseInt(req.query.skip as string, 10);
      const limit: number = parseInt(req.query.limit as string, 10);
      const filteredByDateEventsData: event[] = await this.Eventservice.findEventsByDate(startOfDay, endOfDay, skip, limit);
      res.status(200).json({ data: filteredByDateEventsData, message: 'filteredByDate' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new event.
   * @route POST /Events
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the created event and a message.
   */
  public createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventData: event = req.body;
      const createEventData: event = await this.Eventservice.createEvent(eventData);

      res.status(201).json({ data: createEventData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a event by ID.
   * @route PUT /Events/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the updated event and a message.
   */
  public updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId: string = req.params.id;
      const eventData: event = req.body;
      const updateEventData: event = await this.Eventservice.updateEvent(eventId, eventData);

      res.status(200).json({ data: updateEventData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a event by ID.
   * @route DELETE /Events/:id
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @param next - The next middleware function.
   * @returns A JSON object containing the deleted event and a message.
   */
  public deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId: string = req.params.id;
      const deleteEventData: event = await this.Eventservice.deleteEvent(eventId);

      res.status(200).json({ data: deleteEventData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
