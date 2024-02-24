import { model, Schema, Document, Model } from 'mongoose';
import { Feed } from '../interfaces/feed';

interface FeedDocument extends Feed, Document {}

class FeedModelWrapper {
  private FeedModel: Model<FeedDocument>;

  constructor() {
    try {
      this.FeedModel = model<FeedDocument>('Feed');
    } catch {
      /**
       * Defines the schema for a feed item.
       */
      const FeedSchema: Schema = new Schema(
        {
          /**
           * The main heading of the feed item.
           */
          heading: {
            type: String,
            required: true,
          },
          /**
           * The subheading of the feed item.
           */
          subHeading: {
            type: String,
            required: false,
          },
          /**
           * The link to the feed item.
           */
          link: {
            type: String,
            required: false,
          },
          /**
           * The date associated with the feed item.
           */
          date: {
            type: String,
            required: true,
          },
          /**
           * The provider of the feed item.
           */
          provider: {
            type: String,
            required: true,
          },
        },
        { timestamps: true, strict: false },
      );
      this.FeedModel = model<FeedDocument>('Feed', FeedSchema);
    }
  }

  /**
   * Creates a new feed document in the database.
   * @param feed - The feed object to be created.
   * @returns A Promise that resolves to the created feed document.
   */
  public async create(feed: Feed): Promise<FeedDocument> {
    const createdFeed = new this.FeedModel(feed);
    return createdFeed.save();
  }

  /**
   * Finds all feed documents in the database.
   * @param skip - The number of documents to skip.
   * @param limit - The maximum number of documents to return.
   * @returns A Promise that resolves to an array of feed documents.
   */
  public async findAll(skip: number, limit: number): Promise<FeedDocument[]> {
    return this.FeedModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }

  /**
   * Finds all feed documents in the database filtered by date.
   * @param date - The date to filter the documents.
   * @param skip - The number of documents to skip.
   * @param limit - The maximum number of documents to return.
   * @returns A Promise that resolves to an array of feed documents.
   */
  public async findByDate(startOfDay: Date, endOfDay: Date, skip: number, limit: number): Promise<FeedDocument[]> {
    return this.FeedModel.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Updates a feed document in the database by its ID.
   * @param id - The ID of the feed document to update.
   * @param feed - The updated feed object.
   * @returns A Promise that resolves to the updated feed document.
   */
  public async updateById(id: string, feed: Feed): Promise<FeedDocument | null> {
    return this.FeedModel.findByIdAndUpdate(id, feed, { new: true }).exec();
  }

  /**
   * Deletes a feed document from the database by its ID.
   * @param id - The ID of the feed document to delete.
   * @returns A Promise that resolves to the deleted feed document.
   */
  public async deleteById(id: string): Promise<FeedDocument | null> {
    return this.FeedModel.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes multiple feed documents from the database based on a query.
   * @param query - The query object to filter the documents to delete.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  public async deleteMany(query: any): Promise<any> {
    return this.FeedModel.deleteMany(query).exec();
  }
}

export default FeedModelWrapper;
