const mongoose = require("mongoose");

const User = mongoose.model(
  "Question",
  new mongoose.Schema({
    question: String,
    options: Array,
  })
);

module.exports = User;
