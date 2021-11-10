const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const { MongoClient, MONGO_URL } = require("../database/connection");
const client = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creaing a new mentor
router.post("/create-mentor", async (req, res) => {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
    let db = client.db("studentManagement");
    await db.collection("mentors").insertOne(req.body);
    res.send({
      message: "Mentor created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong while creating mentor!",
    });
  } finally {
    await client.close();
  }
});

// Listing all mentors
router.get("/list-mentors", async (req, res) => {
  try {
    await client.connect();
    let db = client.db("studentManagement");
    let data = await db.collection("mentors").find().toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(404).send({
      message: "Something went wrong while listing mentors!",
    });
  } finally {
    await client.close();
  }
});

// Assign or change mentor for particular student
router.put("/assign-change-mentor/:id", async (req, res) => {
  try {
    let studentId = req.params.id;
    let mentorId = mongodb.ObjectId(req.body.mentor_id);
    await client.connect();
    let db = client.db("studentManagement");
    await db.collection("students").findOneAndUpdate(
      { _id: mongodb.ObjectId(studentId) },
      {
        $set: {
          assignedMentor: req.body.assignedMentor,
          mentor_id: mentorId,
        },
      }
    );
    await db
      .collection("mentors")
      .updateOne(
        { _id: mentorId },
        { $push: { assignedStudents: mongodb.ObjectId(studentId) } }
      );
    res.send({
      message: "Mentor assigned to a particular student!",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send(`Some error occured while assigning a mentor to student!`);
  } finally {
    await client.close();
  }
});
module.exports = router;
