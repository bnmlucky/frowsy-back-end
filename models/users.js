const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { tasksSchema } = require("./tasks.js");

const userSchema = new Schema({
  username: String,
  password: String,
  tasks: [tasksSchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
