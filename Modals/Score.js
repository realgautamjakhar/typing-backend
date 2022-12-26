const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ScoreSchema = new Schema({
  user: mongoose.Schema.Types.ObjectId,
  accuracy: Number,
  score: Number,
  finishedIn: Number,
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

module.exports = mongoose.model("Score", ScoreSchema);
