const { Schema, model, models } = require("mongoose");
const Spot = require("./Spot");

const userSchema = new Schema(
  {
    username: String,
    points: Number,
    discordId: String,
  },
  {
    methods: {
      async addPoints(points) {
        this.points += points;
        await this.save();
      },
      async removePoints(points) {
        this.points -= points;
        await this.save();
      },
      async findValue() {
        // get sum of all spots where this user was spotted in the last two weeks
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const spots = await Spot.find({
          spotted: this._id,
          timestamp: { $gte: twoWeeksAgo },
        });
        return Math.round(50 / (spots.length + 5));
      },
    },
    statics: {
      async findByUsername(username) {
        return this.findOne({ username });
      },
    },
  },
);
module.exports = models.User || model("User", userSchema);
