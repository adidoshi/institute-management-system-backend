const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const { MongoClient, MONGO_URL } = require("../database/connection");
const client = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creating a new student
router.post("/create-student", async (req, res) => {
  try {
    await client.connect();
    let db = client.db("studentManagement");
    await db.collection("students").insertOne(req.body);
    res.send({
      message: "Student created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong while creating student!",
    });
  } finally {
    await client.close();
  }
});

// Listing all students
router.get("/list-students", async (req, res) => {
  try {
    await client.connect();
    let db = client.db("studentManagement");
    let data = await db.collection("students").find().toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(404).send({
      message: "Something went wrong while listing students!",
    });
  } finally {
    await client.close();
  }
});

// Student list to whom a mentor is not assigned yet
router.get("/getstudents", async (req, res) => {
  try {
    await client.connect();
    let db = client.db("studentManagement");
    let data = await db
      .collection("students")
      .find({ assignedMentor: false })
      .toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong while listing students!",
    });
  } finally {
    await client.close();
  }
});

// Assign student to mentor and Select one mentor & add multiple student
router.put("/assign-student/:id", async (req, res) => {
  try {
    await client.connect();
    let mentor_id = req.params.id;
    let db = client.db("studentManagement");
    let userwithID = req.body.assignedStudents.map((elem) =>
      mongodb.ObjectId(elem)
    );
    await db
      .collection("mentors")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(mentor_id) },
        { $addToSet: { assignedStudents: { $each: userwithID } } }
      );
    res.send({
      message: "Student assigned successfully!",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Some error occured while assigning a student to mentor");
  } finally {
    await client.close();
  }
});

// List students of a particular mentor
router.get("/studentsOfParticularMentor/:id", async (req, res) => {
  try {
    await client.connect();
    let db = client.db("studentManagement");
    let mentor_id = req.params.id;
    let studentId = await db
      .collection("students")
      .find({ mentor_id: mongodb.ObjectId(mentor_id) })
      .toArray();
    res.send(studentId);
  } catch (err) {
    res
      .status(404)
      .send("Error occured while listing students of particular mentor");
  } finally {
    await client.close();
  }
});

module.exports = router;
