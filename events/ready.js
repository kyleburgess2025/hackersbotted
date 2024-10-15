const { Events } = require("discord.js");
const dotenv = require("dotenv");
const createBonus = require("../mongo/create-bonus");
const cron = require("cron");

dotenv.config();

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    let scheduledMessage = new cron.CronJob("0 9 * * *", async () => {
      let channel = client.channels.cache.get(process.env.CHANNEL_ID);
      channel.send(await createBonus());
    });

    // When you want to start it, use:
    scheduledMessage.start();
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
