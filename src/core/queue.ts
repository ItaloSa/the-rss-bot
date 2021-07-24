import Queue, { QueueWorker } from 'queue';

const SECCONDS_MULTIPLIER = 1000;
export default class AppQueue {
  queue: Queue;

  constructor(timeout = 10) {
    this.queue = Queue();
    this.queue.timeout = timeout * SECCONDS_MULTIPLIER;
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
