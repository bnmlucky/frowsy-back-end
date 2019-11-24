//DEPENDENCIES
const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const bcrypt = require("bcrypt");

//ROUTES

//NEW
router.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      // console.log("found", foundUser);
      req.session.currentUser = foundUser;
      // console.log("session started");
      res.status(200).json({ foundUser });
    } else {
      res.status(400).json({ error: err.message });
    }
  });
});
//DELETE
router.delete("/", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json({ message: "session ended" });
    }
    // console.log("session destroyed");
  });
});
//EXPORTS
module.exports = router;
