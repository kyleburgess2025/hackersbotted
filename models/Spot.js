const { Schema, model, models } = require("mongoose");
const User = require("./User");
const Bounty = require("./Bounty");

const spotSchema = new Schema(
  {
    spotter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    spotted: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    value: Number,
    timestamp: Date,
    bounty: {
      type: Schema.Types.ObjectId,
      ref: "Bounty",
      required: false,
    },
    bonus: {
      type: Schema.Types.ObjectId,
      ref: "Bonus",
      required: false,
    },
  },
  {
    statics: {
      create: async function ({ spotterId, spottedId }) {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const bonus = await Bonus.findOne({
          userId: spotterId,
          timestamp: { $gte: oneDayAgo },
        });
        const bounty = await Bounty.findOne({
          user: spottedId,
          claimed: false,
        });
        const value =
          User.findById(spottedId).findValue() *
            (bonus ? bonus.multiplier : 0) +
          (bounty ? bounty.value : 0);
        const spot = new this({
          spotter: spotterId,
          spotted: spottedId,
          value,
          timestamp: new Date(),
          bonus: bonus ? bonus._id : null,
          bounty: bounty ? bounty._id : null,
        });
        await spot.save();
        User.findById(spotterId).addPoints(value);
        if (bounty) {
          await User.findById(bounty.user).removePoints(bounty.value);
        }
        return spot;
      },
    },
  },
);

module.exports = models.Spot || model("Spot", spotSchema);
