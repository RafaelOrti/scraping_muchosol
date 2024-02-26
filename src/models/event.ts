import { model, Schema, Document, Model } from 'mongoose';
import { Event } from '../interfaces/event';

interface EventDocument extends Event, Document {}

class EventModelWrapper {
  private eventModel: Model<EventDocument>;

  constructor() {
    try {
      this.eventModel = model<EventDocument>('Event');
    } catch {
      /**
       * Defines the schema for a event item.
       */
      const Eventschema: Schema = new Schema(
        {
          /**
           * The main heading of the event item.
           */
          heading: {
            type: String,
            required: true,
          },
          /**
           * The subheading of the event item.
           */
          subHeading: {
            type: String,
            required: false,
          },
          /**
           * The link to the event item.
           */
          link: {
            type: String,
            required: false,
          },
          /**
           * The date associated with the event item.
           */
          date: {
            type: String,
            required: true,
          },
          /**
           * The provider of the event item.
           */
          provider: {
            type: String,
            required: true,
          },
        },
        { timestamps: true, strict: false },
      );
      this.eventModel = model<EventDocument>('Event', Eventschema);
    }
  }

  /**
   * Creates a new event document in the database.
   * @param event - The event object to be created.
   * @returns A Promise that resolves to the created event document.
   */
  public async create(event: Event): Promise<EventDocument> {
    const createdevent = new this.eventModel(event);
    return createdevent.save();
  }

  /**
   * Finds all event documents in the database.
   * @param skip - The number of documents to skip.
   * @param limit - The maximum number of documents to return.
   * @returns A Promise that resolves to an array of event documents.
   */
  public async findAll(skip: number, limit: number): Promise<EventDocument[]> {
    return this.eventModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }

  /**
   * Finds all event documents in the database filtered by date.
   * @param date - The date to filter the documents.
   * @param skip - The number of documents to skip.
   * @param limit - The maximum number of documents to return.
   * @returns A Promise that resolves to an array of event documents.
   */
  public async findByDate(startOfDay: Date, endOfDay: Date, skip: number, limit: number): Promise<EventDocument[]> {
    return this.eventModel
      .find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Updates a event document in the database by its ID.
   * @param id - The ID of the event document to update.
   * @param event - The updated event object.
   * @returns A Promise that resolves to the updated event document.
   */
  public async updateById(id: string, event: Event): Promise<EventDocument | null> {
    return this.eventModel.findByIdAndUpdate(id, event, { new: true }).exec();
  }

  /**
   * Deletes a event document from the database by its ID.
   * @param id - The ID of the event document to delete.
   * @returns A Promise that resolves to the deleted event document.
   */
  public async deleteById(id: string): Promise<EventDocument | null> {
    return this.eventModel.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes multiple event documents from the database based on a query.
   * @param query - The query object to filter the documents to delete.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  public async deleteMany(query: any): Promise<any> {
    return this.eventModel.deleteMany(query).exec();
  }
}

export default EventModelWrapper;
