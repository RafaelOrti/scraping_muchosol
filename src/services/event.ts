import { HttpException } from '../exceptions/HttpException';
import { event } from '../interfaces/event';
import eventModel from '../models/event';

export class Eventservice {
  event: eventModel;

  constructor() {
    this.event = new eventModel();
  }

  /**
   * Finds all Events with optional pagination.
   * @param skip - The number of Events to skip.
   * @param limit - The maximum number of Events to return.
   * @returns A promise that resolves to an array of Events.
   */
  public async findAllEvents(skip = 0, limit = 100): Promise<event[]> {
    const Events: event[] = await this.event.findAll(skip, limit);
    return Events;
  }

  /**
   * Finds Events by date with optional pagination.
   * @param date - The date to filter Events.
   * @param skip - The number of Events to skip.
   * @param limit - The maximum number of Events to return.
   * @returns A promise that resolves to an array of Events.
   */
  public async findEventsByDate(startOfDay: Date, endOfDay: Date, skip = 0, limit = 100): Promise<event[]> {
    const Events: event[] = await this.event.findByDate(startOfDay, endOfDay, skip, limit);
    return Events;
  }

  /**
   * Creates a new event.
   * @param eventData - The data for the new event.
   * @returns A promise that resolves to the created event.
   */
  public async createevent(eventData: event): Promise<event> {
    const createeventData: event = await this.event.create({ ...eventData });

    return createeventData;
  }

  /**
   * Updates a event by its ID.
   * @param eventId - The ID of the event to update.
   * @param eventData - The updated data for the event.
   * @returns A promise that resolves to the updated event.
   * @throws HttpException if the event doesn't exist.
   */
  public async updateevent(eventId: string, eventData: event): Promise<event> {
    const updateeventById: event = await this.event.updateById(eventId, { ...eventData });
    if (!updateeventById) throw new HttpException(409, "event doesn't exist");

    return updateeventById;
  }

  /**
   * Deletes a event by its ID.
   * @param eventId - The ID of the event to delete.
   * @returns A promise that resolves to the deleted event.
   * @throws HttpException if the event doesn't exist.
   */
  public async deleteevent(eventId: string): Promise<event> {
    const deleteeventById: event = await this.event.deleteById(eventId);
    if (!deleteeventById) throw new HttpException(409, "event doesn't exist");

    return deleteeventById;
  }
}
