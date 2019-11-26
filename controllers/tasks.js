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
router.post("/:id", (req, res) => {
  Tasks.create(req.body, (err, createdTask) => {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { tasks: createdTask }
      },
      { new: true },
      (error, updatedUser) => {
        console.log("this is id:" + req.params.id);
        console.log("updated user:" + updatedUser);
        console.log(error);
      }
    );
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).send(createdTask);
  });
});

/********   DELETE   ************/
router.delete("/:userid/:taskid", (req, res) => {
  const taskFunctions = tasks => {
    const tasksArray = tasks.filter(task => {
      if (task._id == req.params.taskid) {
        console.log("matched");
      } else {
        return task;
      }
    });

    User.update(
      { _id: req.params.userid },
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
  };
  User.findById(req.params.userid, (error, foundUser) => {
    if (error) {
      console.log(error);
    } else {
      taskFunctions(foundUser.tasks);
    }
  });

  Tasks.findByIdAndRemove(req.params.taskid, (err, deletedTask) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(deletedTask);
  });
});
/********   UPDATE    ************/
router.put("/:userid/:taskid", (req, res) => {
  console.log(req.body);
  const taskFunctions = tasks => {
    const tasksArray = tasks.map(task => {
      if (task._id == req.params.taskid) {
        return {
          _id: req.params.taskid,
          description: req.body.description,
          progress: req.body.assigned,
          __v: 0
        };
      } else {
        return task;
      }
    });
    User.update(
      { _id: req.params.userid },
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
  };
  User.findById(req.params.userid, (error, foundUser) => {
    if (error) {
      console.log(error);
    } else {
      taskFunctions(foundUser.tasks);
    }
  });
  Tasks.findByIdAndUpdate(
    req.params.taskid,
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
