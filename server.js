//DEPENDENCIES
const express = require("express");
const app = express();
const port = process.env.PORT || 3003;
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

//MIDDLEWARE

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/DB_NAME";

// Connect to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, () => {
  console.log("connected to mongo database");
});

//CONTROLLERS
app.use(
  session({
    secret: "feedmeseymour", //some random string
    resave: false,
    saveUninitialized: false
  })
);
const usersController = require("./controllers/users.js");

const tasksController = require("./controllers/tasks.js");

const sessionController = require("./controllers/sessions.js");

//WHITELIST
const whitelist = ["*"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/users", usersController);
app.use("/tasks", tasksController);
app.use("/sessions", sessionController);
//ROUTES
app.get("/", (req, res) => {
  res.send("index page");
});
//MONGOOSE
mongoose.connection.on("error", err =>
  console.log(err.message + " is Mongod not running?")
);

mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connect("mongodb://localhost:27017/tasks", {
  useNewUrlParser: true
});
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

//LISTENERS
app.listen(port, () => {
  console.log("listening");
});
