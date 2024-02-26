import { HttpException } from '../exceptions/HttpException';
import { Event } from '../interfaces/event';
import EventModel from '../models/event';

export class EventService {
  event: EventModel;

  constructor() {
    this.event = new EventModel();
  }

  /**
   * Finds all events with optional pagination.
   * @param skip - The number of events to skip.
   * @param limit - The maximum number of events to return.
   * @returns A promise that resolves to an array of events.
   */
  public async findAllEvents(skip = 0, limit = 100): Promise<Event[]> {
    const events: Event[] = await this.event.findAll(skip, limit);
    return events;
  }

  /**
   * Finds events by date with optional pagination.
   * @param date - The date to filter events.
   * @param skip - The number of events to skip.
   * @param limit - The maximum number of events to return.
   * @returns A promise that resolves to an array of events.
   */
  public async findEventsByDate(startOfDay: Date, endOfDay: Date, skip = 0, limit = 100): Promise<Event[]> {
    const events: Event[] = await this.event.findByDate(startOfDay, endOfDay, skip, limit);
    return events;
  }

  /**
   * Creates a new event.
   * @param eventData - The data for the new event.
   * @returns A promise that resolves to the created event.
   */
  public async createEvent(eventData: Event): Promise<Event> {
    const createEventData: Event = await this.event.create({ ...eventData });

    return createEventData;
  }

  /**
   * Updates a event by its ID.
   * @param eventId - The ID of the event to update.
   * @param eventData - The updated data for the event.
   * @returns A promise that resolves to the updated event.
   * @throws HttpException if the event doesn't exist.
   */
  public async updateEvent(eventId: string, eventData: Event): Promise<Event> {
    const updateEventById: Event = await this.event.updateById(eventId, { ...eventData });
    if (!updateEventById) throw new HttpException(409, "Event doesn't exist");

    return updateEventById;
  }

  /**
   * Deletes a event by its ID.
   * @param eventId - The ID of the event to delete.
   * @returns A promise that resolves to the deleted event.
   * @throws HttpException if the event doesn't exist.
   */
  public async deleteEvent(eventId: string): Promise<Event> {
    const deleteEventById: Event = await this.event.deleteById(eventId);
    if (!deleteEventById) throw new HttpException(409, "event doesn't exist");

    return deleteEventById;
  }
}
