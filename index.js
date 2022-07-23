const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Models/User");
const bodyParser = require("body-parser");
const userRoute = require("./Routes/userRoute");
const accRoute = require("./Routes/accRoutes");
const recordRoute = require("./Routes/recordsRoutes");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//routes
app.get("/", (req, res) => {
  res.send("Welcome to Budget Tracker App");
});

app.use("/user", userRoute);
app.use("/acc", accRoute);
app.use("/rec", recordRoute);
//connecting to the DB
mongoose.connect(
  process.env.DB,
  () => {
    console.log("Connected to DataBase");
  }
);

//port
app.listen(1337, () => {
  console.log("server started");
});
