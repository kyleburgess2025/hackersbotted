const { Schema, model, models } = require('mongoose');
const Spot = require('./Spot');

const userSchema = new Schema({
  username: String,
  points: Number,
}, {
  addPoints: async function (points) {
    this.points += points;
    await this.save();
  },
  removePoints: async function (points) {
    this.points -= points;
    await this.save();
  },
  findValue: async function () {
    // get sum of all spots where this user was spotted in the last two weeks
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const spots = await Spot.find({
      spotted: this._id,
      timestamp: { $gte: twoWeeksAgo },
    });
    return Math.round(50 / (spots.length + 5));
  },
})

export default models.User || model('User', userSchema);