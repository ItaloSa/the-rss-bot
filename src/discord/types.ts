import { Message } from 'discord.js';

import { CoreController } from '../core/controller';

export type ActionArgs = {
  controller: CoreController;
  args: string[];
  message: Message;
  handleSendMessage: (content: string, channelId: string) => void;
};

export type FeedMessage = {
  channelId: string;
  title: string;
  description: string;
  timestamp: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
};
