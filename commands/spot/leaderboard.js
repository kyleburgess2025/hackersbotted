const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard of the top 10 users."),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await connect();
    const users = await User.find().sort({ points: -1 }).limit(10);
    let leaderboard = "Leaderboard:\n";
    users.forEach((user, index) => {
      leaderboard += `${index + 1}. <@${user.discordId}> - ${user.points.toFixed(2)} points\n`;
    });
    await interaction.editReply(leaderboard);
  },
};
