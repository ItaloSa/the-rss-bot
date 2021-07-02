import Feed, { FeedType } from './models/feed';
import { connectDb } from './db';

export default class Controller {
  constructor() {
    connectDb();
  }

  async addFeed(data: FeedType) {
    try {
      const server = await Feed.create(data);
      return server;
    } catch (err) {
      console.log(err);
    }
  }
}

export type CoreController = typeof Controller.prototype;
