const mongoose = require("mongoose");

const User = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passWord: {
    type: String,
    required: true,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
});

const model = mongoose.model("User", User); //creating a new model User, and the name of the collection/table is user-data

module.exports = model;
