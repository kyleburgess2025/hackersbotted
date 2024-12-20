const { SlashCommandBuilder } = require("discord.js");
const Bonus = require("../../models/Bonus");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-bonus")
    .setDescription("Gets the bonus for the day."),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await connect();
    const bonus = await Bonus.getTodaysBonus();
    if (!bonus) {
      await interaction.editReply("No bonus today!");
      return;
    }
    await interaction.editReply(
      `Today's bonus is ${bonus.multiplier}x points on <@${bonus.userId.discordId}>!`,
    );
  },
};
