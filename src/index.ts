/* eslint-disable implicit-arrow-linebreak */
import dotenv from 'dotenv';
import express from 'express';

import Controller from './core/controller';
import AppQueue from './core/queue';
import AppCron from './jobs/updates';

dotenv.config();

const app = express();
const PORT = 8000;
let queueInstance: AppQueue;
let cronInstance: AppCron;

const setup = () => {
  queueInstance = new AppQueue();
  queueInstance.start();
  const controller = new Controller();
  cronInstance = new AppCron(queueInstance, controller);
  cronInstance.setup();
};

app.use(express.json());

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  setup();
});
