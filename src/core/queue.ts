import Queue, { QueueWorker } from 'queue';

export default class AppQueue {
  queue: Queue;

  constructor() {
    this.queue = Queue();
    this.queue.timeout = 10 * 1000;
    this.queue.autostart = true;
    this.queue.concurrency = 1;
  }

  enqueue(job: QueueWorker) {
    this.queue.push(job);
  }

  start() {
    this.queue.on('success', (result) => {
      console.log('[Queue] job finished processing');
      console.log('[Queue] The result is:', result);
    });

    this.queue.on('error', (err) => {
      console.log('[Queue] job failed', err);
    });

    this.queue.start((err) => {
      if (err) throw err;
      console.log('[Queue] ready to go!');
    });
  }
}
