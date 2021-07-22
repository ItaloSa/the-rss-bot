/* eslint-disable implicit-arrow-linebreak */
import dotenv from 'dotenv';
import express from 'express';

// import { DiscordBot } from './discord';
import Controller from './core/controller';
// import { parseFeed } from './feed';
// import { aaa } from './test';
import AppQueue from './core/queue';
import AppCron from './core/cron';

dotenv.config();

const app = express();
const PORT = 8000;
let queueInstance: AppQueue;
let cronInstance: AppCron;

// const setupDiscord = () => {
//   const controller = new Controller();
//   const discord = new DiscordBot(controller);
//   discord.start();
// };

app.use(express.json());

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.get('/test', async (req, res) => {
  queueInstance.enqueue(async () => {
    console.log('aaa');
    await cronInstance.fetchData('https://www.braziljs.org/feed');
  });
  res.json({});
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  // setupDiscord();
  queueInstance = new AppQueue();
  queueInstance.start();
  const controller = new Controller();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cronInstance = new AppCron(queueInstance, controller);
  // cronInstance.setup();
  // cronInstance.fetchData('https://kentcdodds.com/blog/rss.xml');
});
