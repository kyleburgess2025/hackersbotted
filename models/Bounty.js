const { Schema, model, models } = require('mongoose');
const User = require('./User');

const bountySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  claimedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  value: Number,
  createdAt: Date,
  claimed: Boolean,
  claimedAt: Date,
},
{
  claim: async function (claimerId) {
    this.claimedBy = claimerId;
    this.claimed = true;
    this.claimedAt = new Date();
    await this.save();
    await User.findById(this.user).removePoints(this.value);
    await User.findById(claimerId).addPoints(this.value);
  },
  getOpenBounties: async function () {
    return this.find({ claimed: false });
  }
})

export default models.Bounty || model('Bounty', bountySchema);