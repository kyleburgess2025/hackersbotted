const { Schema, model, models } = require("mongoose");
const User = require("./User");
const Bounty = require("./Bounty");
const Bonus = require("./Bonus");

const spotSchema = new Schema({
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
  messageId: {
    type: String,
    required: false,
  },
  disputeArr: {
    type: Array,
    required: false,
  },
});

module.exports = models.Spot || model("Spot", spotSchema);
