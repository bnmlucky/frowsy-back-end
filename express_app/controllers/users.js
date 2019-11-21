// DEPENDENCIES
const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const bcrypt = require("bcrypt");

//ROUTES

//GET
router.get("/", (req, res) => {
  User.find({}, (err, foundUsers) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json({ foundUsers });
  });
});
/********   CREATE   ************/
router.post("/", (req, res) => {
  console.log(req.body);
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  User.create(req.body, (err, createdUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).send(createdUser);
  });
});
/********   DELETE   ************/
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(deletedUser);
  });
});
/********   UPDATE    ************/
router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
      res.status(200).json(updatedUser);
    }
  );
});
//EXPORTS
module.exports = router;
