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
//creating account
acc.post("/add", add);
//Getting account details by UserId
acc.get("/get/:uid", accountList);
//deleteing account
acc.post("/del/:aid", deleteAccount);
module.exports = acc;
