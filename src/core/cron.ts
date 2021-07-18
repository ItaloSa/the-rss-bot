/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable class-methods-use-this */
import { CronJob } from 'cron';
import AppQueue from './queue';

export default class AppCron {
  cron: CronJob;

  queue: AppQueue;

  constructor(queueInstance: AppQueue) {
    this.cron = new CronJob(
      '*/1 * * * *',
      this.job(),
      null,
      true,
      'America/Sao_Paulo',
    );
    this.queue = queueInstance;
  }

  setup() {
    this.cron.start();
  }

  job() {
    return () => {
      console.log('[Cron] slow job started');
      this.queue.enqueue(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              console.log('[Cron] slow job finished');
              resolve('ok');
            }, 3000);
          }),
      );
    };
  }
}
