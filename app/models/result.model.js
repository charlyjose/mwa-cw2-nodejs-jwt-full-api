const mongoose = require("mongoose");

const User = mongoose.model(
  "Result",
  new mongoose.Schema({
    userId: String,
    questionId: String,
    optionId: String,
  })
);

module.exports = User;
