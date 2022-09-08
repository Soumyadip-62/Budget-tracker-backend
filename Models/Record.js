const mongoose = require("mongoose");

const Record = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  rType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  },
  note: {
    type: String,
  },
  paymentType: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const model = mongoose.model("Record", Record); //creating a new model User, and the name of the collection/table is user-data

module.exports = model;
