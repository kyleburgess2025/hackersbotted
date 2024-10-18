const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Spot = require("../../models/Spot");
const connect = require("../../mongo/db-connect");
const Bounty = require("../../models/Bounty");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Gets stats for yourself or another hacker!")
    .addUserOption((option) =>
      option
        .setName("username")
        .setDescription("The username of the hacker you want to get stats for.")
        .setRequired(false),
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await connect();
    let discordUser = interaction.options.getUser("username");
    if (!discordUser) {
      discordUser = interaction.user;
    }
    let fullUserAccount = await User.findByUsername(discordUser.username);
    if (!fullUserAccount) {
      interaction.editReply(
        "The user you are trying to get stats for is not registered.",
      );
    }
    let allUsers = await User.find();
    let allUserSpots = await Spot.aggregate([
      {
        $match: {
          spotter: fullUserAccount._id,
        },
      },
      {
        $group: {
          _id: "$spotted",
          totalSpots: { $sum: 1 },
        },
      },
    ]);
    let embed = new EmbedBuilder()
      .setTitle(`Stats for user ${discordUser.username}`)
      .addFields(
        {
          name: "Total Spots",
          value: (
            await Spot.countDocuments({ spotter: fullUserAccount._id })
          ).toString(),
        },
        {
          name: "Total Spotted",
          value: allUserSpots.length.toString(),
        },
        {
          name: "Total Left to be Spotted",
          value: (allUsers.length - allUserSpots.length - 1).toString(),
        },
        {
          name: "Total Points",
          value: fullUserAccount.points.toString(),
        },
        {
          name: "Active Bounties on User",
          value: (
            await Bounty.countDocuments({
              onUser: fullUserAccount._id,
              claimed: false,
            })
          ).toString(),
        },
        {
          name: "Active Bounties Placed by User",
          value: (
            await Bounty.countDocuments({
              byUser: fullUserAccount._id,
              claimed: false,
            })
          ).toString(),
        },
        {
          name: "Total Bounties Claimed",
          value: (
            await Bounty.countDocuments({
              claimedBy: fullUserAccount._id,
              claimed: true,
            })
          ).toString(),
        },
        {
          name: "Total Bounties on User Claimed",
          value: (
            await Bounty.countDocuments({
              onUser: fullUserAccount._id,
              claimed: true,
            })
          ).toString(),
        },
      );
    console.log(allUserSpots);
    for (let i = 0; i < allUserSpots.length; i++) {
      let user = await User.findById(allUserSpots[i]._id);
      embed.addFields({
        name: `Spotted ${user.username}`,
        value: `${allUserSpots[i].totalSpots} times`,
        inline: true,
      });
    }
    const notSpotted = allUsers.filter((user) => {
      return (
        user._id.toString() !== fullUserAccount._id.toString() &&
        !allUserSpots.find((spot) => spot._id.equals(user._id))
      );
    });
    if (notSpotted.length === 0) {
      embed.addFields({
        name: "Not Spotted",
        value: "Everyone has been spotted!",
      });
    } else {
      embed.addFields({
        name: "Not Spotted",
        value: notSpotted.map((user) => `<@${user.discordId}>`).join(", "),
      });
    }
    interaction.editReply({ embeds: [embed] });
  },
};
