const Bonus = require("../models/Bonus");
const User = require("../models/User");
const connect = require("./db-connect");

async function createBonus() {
  await connect();
  let randomUser = (await User.aggregate([{ $sample: { size: 1 } }]))[0];
  const randomMultiplier = Number((Math.random() + 1).toFixed(2))
  console.log(randomMultiplier);
  await Bonus.create({
    userId: randomUser._id,
    multiplier: randomMultiplier,
    timestamp: new Date(),
  });
  return `Today's daily bonus is ${randomMultiplier}x points on <@${randomUser.discordId}>!`;
}

module.exports = createBonus;
