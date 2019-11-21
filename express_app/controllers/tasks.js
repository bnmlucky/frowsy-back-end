//DEPENDENCIES
const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const { Tasks } = require("../models/tasks.js");

//ROUTES
/********   GET  ************/
router.get("/", (req, res) => {
  Tasks.find({}, (err, foundTasks) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json({ foundTasks });
  });
});
/********   CREATE   ************/
router.post("/", (req, res) => {
  console.log(req.body);
  Tasks.create(req.body, (err, createdTask) => {
    User.findByIdAndUpdate(
      req.session.currentUser._id,
      {
        $push: { tasks: createdTask }
      },
      { new: true },
      (error, updatedUser) => {
        console.log("added task to user");
      }
    );
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).send(createdTask);
  });
});
/********   DELETE   ************/
router.delete("/:id", (req, res) => {
  const tasksArray = req.session.currentUser.tasks.filter(task => {
    if (task._id == req.params.id) {
      console.log("matched");
    } else {
      return task;
    }
  });
  User.update(
    { _id: req.session.currentUser._id },
    {
      $set: { tasks: tasksArray }
    },
    { new: true },
    (error, updatedUser) => {
      if (error) {
        console.log(error);
      } else {
        console.log(updatedUser);
      }
    }
  );
  Tasks.findByIdAndRemove(req.params.id, (err, deletedTask) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(deletedTask);
  });
});
/********   UPDATE    ************/
router.put("/:id", (req, res) => {
  const tasksArray = req.session.currentUser.tasks.map(task => {
    if (task._id == req.params.id) {
      return {
        _id: req.params.id,
        description: req.body.description,
        progress: req.body.assigned,
        __v: 0
      };
    } else {
      return task;
    }
  });
  User.update(
    {
      _id: req.session.currentUser._id
    },
    {
      $set: { user2chores: tasksArray }
    },
    { new: true },
    (error, updatedUser) => {
      if (error) {
        console.log(error);
      } else {
        console.log(updatedUser);
      }
    }
  );
  Tasks.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedTask) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
      res.status(200).json(updatedTask);
    }
  );
});
//EXPORTS
module.exports = router;

// curl -X POST -H "Content-Type: application/json" -d '{"description":"Test", "progress": "to-do"}' http://localhost:3003/tasks

// curl -X POST -H "Content-Type: application/json" -d '{"username":"Test", "password": "123"}' http://localhost:3003/users
