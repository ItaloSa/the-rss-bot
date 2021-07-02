import dotenv from 'dotenv';
import express from 'express';

import { DiscordBot } from './discord';
import Controller from './core/controller';
// import { parseFeed } from './feed';
// import { aaa } from './test';

dotenv.config();

const app = express();
const PORT = 8000;

const setupDiscord = () => {
  const controller = new Controller();
  const discord = new DiscordBot(controller);
  discord.start();
};

app.use(express.json());

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.get('/test', async (req, res) => {
  // const ress = await parseFeed();
  // res.json(ress);
  // aaa();
  res.json({});
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  setupDiscord();
});
