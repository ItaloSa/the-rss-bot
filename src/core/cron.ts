/* eslint-disable no-underscore-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable class-methods-use-this */
import { CronJob } from 'cron';
import Parser from 'rss-parser';
import checksum from 'checksum';
import { pick } from 'lodash';

import AppQueue from './queue';
import AppController from './controller';
import { FeedDocument } from './models/feed';

export default class AppCron {
  cron: CronJob;

  queue: AppQueue;

  appController: AppController;

  constructor(queueInstance: AppQueue, appController: AppController) {
    this.cron = new CronJob(
      '*/1 * * * *',
      this.job(),
      null,
      true,
      'America/Sao_Paulo',
    );
    this.queue = queueInstance;
    this.appController = appController;
  }

  setup() {
    this.cron.start();
  }

  // job() {
  //   return () => {
  //     console.log('[Cron] slow job started');
  //     this.queue.enqueue(
  //       () =>
  //         new Promise((resolve) => {
  //           setTimeout(() => {
  //             console.log(a);
  //             console.log('[Cron] slow job finished');
  //             resolve(a);
  //           }, 3000);
  //         }),
  //     );
  //   };
  // }

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

        console.log('sent to discord', shaped);
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

  shapeData(result: Parser.Output<any>) {
    return {
      ...pick(result, ['title', 'description', 'link']),
      item: result.items.length ? result.items[0] : null,
    };
  }

  calcChecksum(currentHash: string, item: Parser.Item) {
    const hash = checksum(`${item.title}${item.isoDate}`);
    return currentHash === hash ? null : hash;
  }
}
