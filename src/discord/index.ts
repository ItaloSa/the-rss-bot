import Discord from 'discord.js';

class DiscordBot {
  client: Discord.Client;
  prefix: string;

  constructor() {
    console.log('>> bot instance created');
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
      // TODO -> handle
    });
  }

  sendMessage() {
    console.log('>> send message');
    const message = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org/');
    const channel = this.client.channels.cache.get(
      '834152764614901813',
    ) as Discord.TextChannel;
    channel.send(message);
  }
}

export const discord = new DiscordBot();
