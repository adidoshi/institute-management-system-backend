const express = require("express");
const morgon = require("morgan");
const dotenv = require("dotenv");

const app = express();
let studentRouter = require("./routes/student");
let mentorRouter = require("./routes/mentor");

dotenv.config();
let PORT = process.env.PORT || 4000;

// Middlewares
app.use(morgon("tiny"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/api", studentRouter);
app.use("/api", mentorRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up",
    title: "Welcome to institue management rest API ",
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
