const mongoose = require("mongoose");

const dbURL = process.env.DB_URL;
console.log(dbURL);
// once
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
