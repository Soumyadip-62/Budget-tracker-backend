const express = require("express");
const acc = express.Router();
const mongoose = require("mongoose");
const {
  add,
  accountList,
  deleteAccount,
} = require("../controllers/AccountController");
const Account = require("../Models/Account");
const User = require("../Models/User");
const authenticator = require("../middleware/authenticator");


//creating account
acc.post("/add", authenticator, add);
//Getting account details by UserId
acc.get("/get", authenticator, accountList);
//deleteing account
acc.get("/delete/:aid", authenticator, deleteAccount);
module.exports = acc;
