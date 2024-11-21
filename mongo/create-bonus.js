const Bonus = require("../models/Bonus");
const User = require("../models/User");
const connect = require("./db-connect");

function randomSkewNormal(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )

  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0)
    num = randomSkewNormal(min, max, skew) // resample between 0 and 1 if out of range

  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

async function createBonus() {
  await connect();
  let randomUser = (await User.aggregate([{ $sample: { size: 1 } }]).exec())[0];
  const randomMultiplier = Number(randomSkewNormal(1.0, 3.0, 1.5).toFixed(2))
  await Bonus.create({
    userId: randomUser._id,
    multiplier: randomMultiplier,
    timestamp: new Date(),
  });
  return `Today's daily bonus is ${randomMultiplier}x points on <@${randomUser.discordId}>!`;
}

module.exports = createBonus;
