const { Events } = require("discord.js");
const Spot = require("../models/Spot");
const { deleteSpot } = require("../helpers/utilities");
const connect = require("../mongo/db-connect");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    } else if (interaction.isButton()) {
      // respond to the button
      await interaction.deferUpdate();
      await connect();
      let currentContent = interaction.message.content;
      const messageId = interaction.message.interaction.id;
      const userId = interaction.user.id;
      const spot = await Spot.findOne({ messageId: messageId });
      if (!spot) {
        console.log("No spot found for message id", messageId);
        return;
      } else if (!spot.disputeArr || spot.disputeArr.length === 0) {
        spot.disputeArr = [userId];
        await spot.save();
        currentContent += `\n\nThis has been disputed by ${spot.disputeArr.length} member`+ (spot.disputeArr.length > 1 ? 's' : '') + `. 3 disputes are needed to delete this spot.`;
      } else if (spot.disputeArr.includes(userId)) {
        console.log("User already disputed this spot");
        return;
      } else {
        spot.disputeArr = !spot.disputeArr ? [] : spot.disputeArr;
        spot.disputeArr.push(userId);
        await spot.save();
        currentContent = getOriginalContent(currentContent);
        if (spot.disputeArr.length >= 3) {
          currentContent +=
            "\n\nThis spot has been disputed by 3 members and will not be counted toward point values!";
          await deleteSpot(messageId);
          interaction.editReply({ components: [] });
        } else {
          currentContent += `\n\nThis has been disputed by ${spot.disputeArr.length} member`+ (spot.disputeArr.length > 1 ? 's' : '') + `. 3 disputes are needed to delete this spot.`;
        }
      }
      await interaction.editReply(currentContent);
    }
  },
};

const getOriginalContent = (message) => {
  const messageArr = message.split("\n");
  const originalContent = messageArr.slice(0, messageArr.length - 2).join("\n");
  return originalContent;
};
