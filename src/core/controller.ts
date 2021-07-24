/* eslint-disable class-methods-use-this */
import { Feed, FeedModel } from './models/feed';
import { connectDb } from './db';

type FeedFilter = { serverId?: string };

export default class Controller {
  constructor() {
    connectDb();
  }

  async addFeed(data: Feed) {
    let result = null;
    try {
      result = await FeedModel.create(data);
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  async getFeeds() {
    let result = null;
    try {
      result = await FeedModel.find({ deleted: false, activated: true });
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  async getFilteredFeeds({ serverId = '' }: FeedFilter): Promise<Feed[]> {
    let result: Feed[] = [];
    try {
      result = await FeedModel.find({ deleted: false, serverId });
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  async updateChecksum(id: string, latestChecksum: string) {
    let result = null;
    try {
      result = await FeedModel.findByIdAndUpdate(
        id,
        { latestChecksum },
        { useFindAndModify: false },
      );
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  async removeFeed(id: string) {
    let result = null;
    try {
      result = await FeedModel.findByIdAndUpdate(
        id,
        { deleted: true },
        { useFindAndModify: false },
      );
    } catch (err) {
      console.log(err);
    }
    return result;
  }
}

export type CoreController = typeof Controller.prototype;
