import { Feed } from '../core/models/feed';
import { ACTIONS } from './constants';
import { ActionArgs } from './types';

const renderFeedItem = (item: Feed): string => `
  :newspaper2: **${item.name}**
  **ID:** ${item._id}
  **Channel ID:** ${item.channelId}
  **Link:** ${item.link}
`;

const addFeed = async ({
  controller,
  args,
  message,
}: ActionArgs): Promise<string> => {
  const name = args[1];
  const link = args[2];

  await controller.addFeed({
    channelId: message.channel.id,
    serverId: message.guild?.id || '',
    name,
    createdBy: message.author.id,
    link,
    activated: true,
    deleted: false,
    latestChecksum: '',
  });

  return 'Feed added :partying_face:';
};

const listFeed = async ({
  controller,
  message,
}: ActionArgs): Promise<string> => {
  const items = await controller.getFilteredFeeds({
    serverId: message.guild?.id,
  });

  if (!items.length) {
    return `:broken_heart: List feed has empty! =(`;
  }

  const renders = items.map((item) => renderFeedItem(item)).join('');

  return `:notepad_spiral: (${items.length}) Feeds: \n ${renders}`;
};

const removeFeed = async ({
  controller,
  args,
}: ActionArgs): Promise<string> => {
  const feedId = args[1];

  await controller.removeFeed(feedId);

  return 'Feed removed :white_check_mark:';
};

export const actions = {
  [ACTIONS.ADD]: addFeed,
  [ACTIONS.LIST]: listFeed,
  [ACTIONS.REMOVE]: removeFeed,
};
