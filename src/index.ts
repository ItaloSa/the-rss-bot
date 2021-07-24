/* eslint-disable implicit-arrow-linebreak */
import dotenv from 'dotenv';
import express from 'express';

import Controller from './core/controller';
import AppQueue from './core/queue';
import { DiscordBot } from './discord';
import AppCron from './jobs/updates';

dotenv.config();

const app = express();
const PORT = 8000;
let queueInstance: AppQueue;
let cronInstance: AppCron;

const setup = () => {
  const controller = new Controller();
  const discord = new DiscordBot(controller);

  discord.start();

  queueInstance = new AppQueue();
  queueInstance.start();

  cronInstance = new AppCron(queueInstance, controller, discord);
  cronInstance.setup();
};

app.use(express.json());

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  setup();
});
