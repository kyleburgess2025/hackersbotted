const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const Bounty = require("../../models/Bounty");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("Gets information about a user or yourself.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription(
          "The username of the user you want to get information about",
        )
        .setRequired(false),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    await connect();
    let username = interaction.options.getString("username");
    if (!username) {
      username = interaction.user.username;
    }
    const user = await User.findOne({ username });
    if (!user) {
      await interaction.reply("User not found.");
      return;
    }
    let userInfo = `Username: ${user.username}\nPoints: ${user.points}`;
    const bounties = await Bounty.find({ onUser: user._id, claimed: false });
    const heldBounties = await Bounty.find({
      byUser: user._id,
      claimed: false,
    });
    if (bounties.length > 0) {
      userInfo += `\nBounties: ${bounties.length}`;
    }
    if (heldBounties.length > 0) {
      userInfo += `\nHeld Bounties: ${heldBounties.length}`;
    }
    await interaction.editReply(userInfo);
  },
};
