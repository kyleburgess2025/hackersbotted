const Spot = require("../models/Spot");
const User = require("../models/User");
const Bonus = require("../models/Bonus");
const Bounty = require("../models/Bounty");

async function deleteSpot(messageId) {
  // find all bounties that are claimed by this spot
  const spots = await Spot.find({ messageId: messageId });
  for (const spot of spots) {
    if (spot.bounty) {
      let bounty = await Bounty.findById(spot.bounty);
      bounty.claimed = false;
      await bounty.save();
    }
    await (await User.findById(spot.spotter)).removePoints(spot.value);
    //delete spot
    await Spot.findByIdAndDelete(spot._id);
  }
}

async function formatSpot(spot) {
  const spotted = await User.findById(spot.spotted);
  let content = "";
  if (spot.bounty) {
    const bounty = await Bounty.findById(spot.bounty).populate("bountyCreator");
    content += `\nSpotted <@${spotted.discordId}> and earned <@${bounty.bountyCreator.discordId}>'s bounty of ${bounty.value} points!`;
  }
  if (spot.bonus) {
    const bonus = await Bonus.findById(spot.bonus);
    content += `\nSpotted <@${spotted.discordId}> and earned a bonus multiplier of ${bonus.multiplier}!`;
  }
  return content;
}

module.exports = { deleteSpot, formatSpot };
