const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-users")
    .setDescription("Lists all registered users."),
  async execute(interaction) {
    await interaction.deferReply();
    await connect();
    const users = await User.find();
    let userList = "Users:\n";
    users.forEach((user, index) => {
      userList += `${index + 1}. ${user.username}\n`;
    });
    await interaction.editReply(userList);
  },
};
