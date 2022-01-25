const dbConfig = require("../config/database.config.js");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;
db.user = require("./user.model");
db.role = require("./role.model");
db.question = require("./question.model");
db.result = require("./result.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;