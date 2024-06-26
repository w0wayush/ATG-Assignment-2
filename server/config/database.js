const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`Successfully Connected DB on port ${process.env.PORT}`);
    })
    .catch((err) => {
      console.log("Issue in DB Connection");
      console.log(err.message);
      process.exit(1);
    });
};

module.exports = connectDB;
