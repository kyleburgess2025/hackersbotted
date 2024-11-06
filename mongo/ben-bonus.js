const Bonus = require("../models/Bonus");
const User = require("../models/User");
const connect = require("./db-connect");

async function createBonus() {
  await connect();
  let randomUser = await User.findByUsername("conjugation")
  const randomMultiplier = 3;
  await Bonus.create({
    userId: randomUser._id,
    multiplier: randomMultiplier,
    timestamp: new Date(),
  });
  return `Today's daily bonus is ${randomMultiplier}x points on <@conjugation>!`;
}

module.exports = createBonus;