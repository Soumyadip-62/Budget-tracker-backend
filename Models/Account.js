const mongoose = require("mongoose");

const Account = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accName: {
    type: String,
    required: true,
  },
  accType: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    required: true,
  },
  records: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
});

const model = mongoose.model("Account", Account); //creating a new model User, and the name of the collection/table is user-data

module.exports = model;
