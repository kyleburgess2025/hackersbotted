const { Schema, model, models } = require("mongoose");
const User = require("./User");

const bountySchema = new Schema(
  {
    bountyCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    onUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    value: Number,
    createdAt: Date,
    claimed: Boolean,
    claimedAt: Date,
  },
  {
    methods: {
      claim: async function (claimerId) {
        this.claimedBy = claimerId;
        this.claimed = true;
        this.claimedAt = new Date();
        await this.save();
      },
      getOpenBounties: async function () {
        return this.find({ claimed: false });
      },
    },
  },
);

module.exports = models.Bounty || model("Bounty", bountySchema);
