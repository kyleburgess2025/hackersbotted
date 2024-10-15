const { SlashCommandBuilder } = require("discord.js");
const Bounty = require("../../models/Bounty");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-bounties")
    .setDescription("Gets all active bounties."),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await connect();
    const bounties = await Bounty.find({ claimed: false })
      .populate("bountyCreator")
      .populate("onUser")
      .exec();
    let bountyList = "Bounties:\n";
    bounties.forEach((bounty, index) => {
      bountyList += `${index + 1}. ${bounty.onUser.username} - ${
        bounty.value
      } points - placed by ${bounty.bountyCreator.username}\n`;
    });
    await interaction.editReply(bountyList);
  },
};
