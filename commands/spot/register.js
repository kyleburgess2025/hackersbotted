const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registers a HackerSbotted account!"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await connect();
    const user = interaction.user;
    const userExists = await User.exists({ username: user.username });

    if (userExists) {
      await interaction.editReply("You already have an account!");
      return;
    }

    await User.create({
      username: user.username,
      points: 0,
      discordId: user.id,
    });

    await interaction.editReply({
      content: "Your account has been created, welcome to HackerSbotted!",
    });
  },
};
