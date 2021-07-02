import Discord from 'discord.js';
import { CoreController } from '../core/controller';

export class DiscordBot {
  client: Discord.Client;
  prefix: string;
  controller: CoreController;

  constructor(controller: CoreController) {
    console.log('>> bot instance created');
    this.controller = controller;
    this.client = new Discord.Client();
    this.prefix = '$';
  }

  start() {
    console.log('>> bot started');
    this.client.login(process.env.BOT_TOKEN);
    this.setListeners();
  }

  setListeners() {
    this.client.on('ready', () => {
      console.log('⚡️[discord]: bot ready');
    });

    this.client.on('message', (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(this.prefix)) return;
      const commandBody = message.content.slice(this.prefix.length);
      const args = commandBody.split(' ');
      this.handleMessage(args, message);
    });
  }

  //  sendMessage() {
  //   console.log('>> send message');
  //   const message = new Discord.MessageEmbed()
  //     .setColor('#0099ff')
  //     .setTitle('Some title')
  //     .setURL('https://discord.js.org/');
  //   const channel = this.client.channels.cache.get(
  //     '834152764614901813',
  //   ) as Discord.TextChannel;
  //   channel.send(message);
  // }

  async sendSimpleMessage(content: string, channelId: string) {
    const channel = this.client.channels.cache.get(channelId) as Discord.TextChannel;
    channel.send(content);
  }

  async handleMessage(args: string[], message: Discord.Message) {
    try {
      switch (args[0]) {
        case 'feed-add':
          await this.controller.addFeed({
            channelId: message.channel.id,
            serverId: message.guild?.id || '',
            name: args[1],
            createdBy: message.author.id,
            link: args[2],
            activated: true,
            deleted: false,
          });
          await this.sendSimpleMessage('Feed added :partying_face:', message.channel.id);
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
