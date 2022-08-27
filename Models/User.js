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
    unique: true,
    required: true,
    dropDups: true,
  },
  secretOtp:{
type:Number,
required:false,
select:false
  },
  passWord: {
    type: String,
    required: true,
    select: false, //to hide the password in api responces
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
