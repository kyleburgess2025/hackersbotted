const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const Bounty = require("../../models/Bounty");
const connect = require("../../mongo/db-connect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("Gets information about a user or yourself.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "The user you want to get information about",
        )
        .setRequired(false),
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await connect();
    let discordUser = interaction.options.getUser("user");
    let username = interaction.user.username;
    if (discordUser) {
      username = discordUser.username;
    }
    const user = await User.findOne({ username });
    if (!user) {
      await interaction.reply("User not found.");
      return;
    }
    const pointValue = await user.findValue();
    let userInfo = `Username: ${user.username}\nPoints: ${user.points}\nValue: ${pointValue}`;
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
