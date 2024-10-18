const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const Bounty = require("../../models/Bounty");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-bounty")
    .setDescription("Creates a bounty on a user.")
    .addUserOption((option) =>
      option
        .setName("username")
        .setDescription("The user you want to put a bounty on.")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("points")
        .setDescription("The amount of points you want to put on the bounty.")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    await connect();
    const discordUser = interaction.options.getUser("username");
    const username = discordUser.username;
    const points = interaction.options.getInteger("points");
    const bountyCreator = await User.findByUsername(interaction.user.username);
    const user = await User.findByUsername(username);
    if (points < 0) {
      await interaction.editReply("You cannot create a bounty with negative points.");
      return;
    }
    if (!user || !bountyCreator) {
      await interaction.editReply("User not found.");
      return;
    }
    if (bountyCreator.points < points) {
      await interaction.editReply(
        "You do not have enough points to create this bounty.",
      );
      return;
    }
    const currentBounty = await Bounty.findOne({
      onUser: user._id,
      claimed: false,
    });
    if (currentBounty) {
      await interaction.editReply("You already have an active bounty.");
      return;
    }
    await Bounty.create({
      bountyCreator: bountyCreator._id,
      onUser: user._id,
      value: points,
      claimed: false,
    });
    await interaction.editReply(
      `Bounty created on ${discordUser} for ${points} points.`,
    );
  },
};
