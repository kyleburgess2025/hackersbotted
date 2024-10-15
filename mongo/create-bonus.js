const Bonus = require("../models/Bonus");
const User = require("../models/User");
const connect = require("./db-connect");

async function createBonus() {
  await connect();
  let randomUser = (await User.aggregate([{ $sample: { size: 1 } }]))[0];
  const randomMultiplier = Math.random().toFixed(2) + 1;
  await Bonus.create({
    userId: randomUser._id,
    multiplier: randomMultiplier,
    timestamp: new Date(),
  });
  return `Today's daily bonus is ${randomMultiplier}x points on <@${randomUser.discordId}>!`;
}

module.exports = createBonus;
