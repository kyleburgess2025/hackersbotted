const { Schema, model, models } = require("mongoose");

const bonusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  multiplier: Number,
  timestamp: Date,
});

module.exports = models.Bonus || model("Bonus", bonusSchema);
