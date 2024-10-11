const { Schema, model, models } = require('mongoose');
const User = require('./User');
const Bounty = require('./Bounty');

const spotSchema = new Schema({
  spotter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  spotted: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  value: Number,
  timestamp: Date,
  validated: Boolean,
  bounty: {
    type: Schema.Types.ObjectId,
    ref: 'Bounty',
    required: false,
  },
  bonus: {
    type: Schema.Types.ObjectId,
    ref: 'Bonus',
    required: false,
  },
},
{
  create: async function ({ spotterId, spottedId }) {
    const spot = new this({
      spotter: spotterId,
      spotted: spottedId,
      value: User.findById(spottedId).findValue(),
      timestamp: new Date(),
      validated: false,
    });
    await spot.save();
  },
  validate: async function () {
    this.validated = true;
    await this.save();
    await User.findById(this.spotted).addPoints(this.value);
    const bounty = await Bounty.findOne({ user: spottedId, claimed: false });
    if (bounty) {
      await User.findById(this.spotter).addPoints(this.value);
      await User.findById(this.spotted).removePoints(this.value);
      await this.bounty.claim(this.spotter);
      return bounty;
    }
  }
})

export default models.Spot || model('Spot', spotSchema);