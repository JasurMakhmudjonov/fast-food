const config = require("../../config");
const mongoose = require("mongoose");

const connectionDb = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectionDb;
