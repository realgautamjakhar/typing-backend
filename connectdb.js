let dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const mongooseUri = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
const connectDb = async () => {
  mongoose.connect(mongooseUri, () => {
    console.log("Connected to database");
  });
};

module.exports = connectDb;
