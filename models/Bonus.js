const { Schema, model, models } = require("mongoose");

const bonusSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    multiplier: Number,
    timestamp: Date,
  },
  {
    statics: {
      async getTodaysBonus() {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.findOne({
          timestamp: { $gte: yesterday },
        })
          .populate("userId")
          .exec();
      },
    },
  },
);

module.exports = models.Bonus || model("Bonus", bonusSchema);
