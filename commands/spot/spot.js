const { SlashCommandBuilder } = require("discord.js");
const connect = require("../../mongo/db-connect");
const Spot = require("../../models/Spot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spot")
    .setDescription("Spots a hacker!")
    .addAttachmentOption((option) =>
      option
        .setName("photo")
        .setDescription("The photo of the hacker")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("hacker")
        .setDescription("The hacker you are spotting")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Image description")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("hacker2")
        .setDescription("The second hacker you are spotting")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("hacker3")
        .setDescription("The third hacker you are spotting")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("hacker4")
        .setDescription("The fourth hacker you are spotting")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("hacker5")
        .setDescription("The fifth hacker you are spotting")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("hacker6")
        .setDescription("The sixth hacker you are spotting")
        .setRequired(false),
    ),
  async execute(interaction) {
    // await interaction.reply('Pong!');
    const photo = interaction.options.getAttachment("photo");
    const description = interaction.options.getString("description");
    const hacker = interaction.options.getUser("hacker");
    const hacker2 = interaction.options.getUser("hacker2");
    const hacker3 = interaction.options.getUser("hacker3");
    const hacker4 = interaction.options.getUser("hacker4");
    const hacker5 = interaction.options.getUser("hacker5");
    const hacker6 = interaction.options.getUser("hacker6");
    const hackers = [hacker, hacker2, hacker3, hacker4, hacker5, hacker6];
    // filter out hackers that are not defined
    const filteredHackers = hackers.filter((hacker) => hacker !== null);
    console.log(filteredHackers);
    // if any of the hackers are the same, respond with an error
    if (new Set(filteredHackers).size !== filteredHackers.length) {
      return await interaction.reply({
        content: "You can't spot the same hacker twice in one photo!",
      });
    }

    await connect();

    const spot = Spot.create({ spotterId, spottedId, value });

    const content = `${filteredHackers.join(
      " ",
    )}, you have been spotted: ${description}`;
    // respond with the photo and the hacker,
    await interaction.reply({ content, files: [photo] });
  },
};
