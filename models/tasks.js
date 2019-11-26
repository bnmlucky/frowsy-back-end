const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
  description: String,
  progress: String
});

const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = { tasksSchema: tasksSchema, Tasks: Tasks };
