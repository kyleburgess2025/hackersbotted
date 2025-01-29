const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const connect = require("../../mongo/db-connect");
const Spot = require("../../models/Spot");
const User = require("../../models/User");
const Bonus = require("../../models/Bonus");
const Bounty = require("../../models/Bounty");
const { formatSpot } = require("../../helpers/utilities");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spot")
    .setDescription("Spots a hacker!")
    .addAttachmentOption((option) =>
      option
        .setName("photo")
        .setDescription("The photo of the hacker")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("hacker")
        .setDescription("The hacker you are spotting")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Image description")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("hacker2")
        .setDescription("The second hacker you are spotting")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("hacker3")
        .setDescription("The third hacker you are spotting")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("hacker4")
        .setDescription("The fourth hacker you are spotting")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("hacker5")
        .setDescription("The fifth hacker you are spotting")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("hacker6")
        .setDescription("The sixth hacker you are spotting")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const photo = interaction.options.getAttachment("photo");
    const description = interaction.options.getString("description");
    const hacker = interaction.options.getUser("hacker");
    const hacker2 = interaction.options.getUser("hacker2");
    const hacker3 = interaction.options.getUser("hacker3");
    const hacker4 = interaction.options.getUser("hacker4");
    const hacker5 = interaction.options.getUser("hacker5");
    const hacker6 = interaction.options.getUser("hacker6");
    const hackers = [hacker, hacker2, hacker3, hacker4, hacker5, hacker6];
    const dispute = new ButtonBuilder()
      .setCustomId("dispute")
      .setLabel("Dispute")
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(dispute);
    // filter out hackers that are not defined
    const filteredHackers = hackers.filter((hacker) => hacker !== null);
    // if any of the hackers are the same, respond with an error
    if (new Set(filteredHackers).size !== filteredHackers.length) {
      return await interaction.editReply({
        content: "You can't spot the same hacker twice in one photo!",
      });
    }

    await connect();

    const spotter = await User.findByUsername(interaction.user.username);
    if (!spotter) {
      return await interaction.editReply({
        content: `You need to register first!`,
      });
    }

    const spots = [];

    for (const hacker of filteredHackers) {
      const spotted = await User.findByUsername(hacker.username);
      if (!spotted) {
        return await interaction.editReply({
          content: `User ${hacker.username} not found; make sure they are registered first.`,
        });
      }
      if (spotted.username === interaction.user.username) {
        return await interaction.editReply({
          content: `You can't spot yourself!`,
        });
      }
      spots.push(await spot(spotter._id, spotted._id, interaction.id));
    }

    let content = `${filteredHackers.join(
      " "
    )}, you have been spotted: ${description}`;

    for (const spot of spots) {
      content += await formatSpot(spot);
    }

    content +=
      "\nYou earned a total of " +
      spots.reduce((acc, spot) => acc + spot.value, 0) +
      " points!";
    // respond with the photo and the hacker,
    await interaction.editReply({ content, files: [photo], components: [row] });
  },
};

async function spot(spotterId, spottedId, messageId) {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const bonus = await Bonus.findOne({
    userId: spottedId,
    timestamp: { $gte: oneDayAgo },
  });
  const bounty = await Bounty.findOne({
    onUser: spottedId,
    claimed: false,
  });
  const value =
    (await (await User.findById(spottedId)).findValue()) *
      (bonus ? bonus.multiplier : 1) +
    (bounty ? bounty.value : 0);
  const spot = new Spot({
    spotter: spotterId,
    spotted: spottedId,
    value: Math.round(value),
    timestamp: new Date(),
    bonus: bonus ? bonus._id : null,
    bounty: bounty ? bounty._id : null,
    messageId: messageId,
  });
  await spot.save();
  await (await User.findById(spotterId)).addPoints(value);
  if (bounty) {
    await (
      await User.findById(bounty.bountyCreator)
    ).removePoints(bounty.value);
    bounty.claim(spotterId);
  }
  return spot;
}
