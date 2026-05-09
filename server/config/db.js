const mongoose = require("mongoose");

const dbURL = process.env.DB_URL;

const connectDB = async () => {
  if (!dbURL) {
    throw new Error("DB_URL is not set");
  }
  await mongoose.connect(dbURL);
  console.log("connected to db");
};

module.exports = connectDB;
