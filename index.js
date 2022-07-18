const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Models/User");
const userRoute = require("./Routes/userRoute");
const accRoute = require("./Routes/accRoutes");
const recordRoute = require("./Routes/recordsRoutes");
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("Server Started");
});

app.use("/user", userRoute);
app.use("/acc", accRoute);
app.use("/rec", recordRoute);
//connecting to the DB
mongoose.connect(
  "mongodb+srv://soumyabudgetapp:5i4XBejVBwXKpvD@cluster0.yvtbg.mongodb.net/?retryWrites=true&w=majority",
  () => {
    console.log("Connected to DB");
  }
);

//port
app.listen(1337, () => {
  console.log("server started");
});
