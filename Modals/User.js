const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  highestScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
