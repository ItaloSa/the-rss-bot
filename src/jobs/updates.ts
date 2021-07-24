/* eslint-disable no-underscore-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable class-methods-use-this */
import { CronJob } from 'cron';
import Parser from 'rss-parser';
import checksum from 'checksum';
import { pick } from 'lodash';

import AppQueue from '../core/queue';
import AppController from '../core/controller';
import { FeedDocument } from '../core/models/feed';
import { DiscordBot } from '../discord';

export default class AppCron {
  cron: CronJob;

  queue: AppQueue;

  appController: AppController;

  discordInstance: DiscordBot;

  constructor(
    queueInstance: AppQueue,
    appController: AppController,
    discordInstance: DiscordBot,
  ) {
    // every minute - '*/1 * * * *'
    // every 15 minute - '*/15 * * * *'
    this.cron = new CronJob(
      '*/15 * * * *',
      this.job(),
      null,
      true,
      'America/Sao_Paulo',
    );
    this.queue = queueInstance;
    this.appController = appController;
    this.discordInstance = discordInstance;
  }

  setup() {
    this.cron.start();
  }

  job() {
    return async () => {
      console.log('[Cron] job started');
      try {
        const feeds = await this.appController.getFeeds();
        if (!feeds) {
          console.log('[Cron] job finished, no feed to process');
          return;
        }
        feeds.forEach((item) => {
          this.queue.enqueue(this.execute(item));
        });
      } catch (err) {
        console.log(err);
      }
    };
  }

  execute(item: FeedDocument) {
    return async () => {
      try {
        const data = await this.fetchData(item.link);
        if (!data) {
          console.log(`[Queue task] No data found for feed ${item._id}`);
          return;
        }
        const shaped = this.shapeData(data);

        const checksumCalc = this.calcChecksum(
          item.latestChecksum,
          shaped.item,
        );
        if (!checksumCalc) {
          console.log(`[Queue task] No updates found for feed ${item._id}`);
          return;
        }

        const result = await this.appController.updateChecksum(
          item._id,
          checksumCalc,
        );
        if (!result) {
          console.log(
            `[Queue task] Failed update checksum for feed ${item._id}`,
          );
          return;
        }

        await this.discordInstance.sendFeedMessage({
          channelId: item.channelId,
          title: shaped.item.title || '',
          description: shaped.item.contentSnippet || '',
          timestamp: shaped.item.isoDate || 'N/A',
          url: shaped.item.link || '',
          author: { name: shaped.title || '', url: shaped.link || '' },
        });
      } catch (err) {
        console.log('[Queue task] fail');
        console.log(err);
      }
    };
  }

  async fetchData(url: string) {
    let result = null;
    try {
      const parser = new Parser();
      result = await parser.parseURL(url);
      return result;
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  shapeData(result: Parser.Output<unknown>) {
    return {
      ...pick(result, ['title', 'description', 'link']),
      item: result.items.length ? result.items[0] : {},
    };
  }

  calcChecksum(currentHash: string, item: Parser.Item) {
    const hash = checksum(`${item.title}${item.isoDate}`);
    return currentHash === hash ? null : hash;
  }
}
