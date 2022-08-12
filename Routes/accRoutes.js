const express = require("express");
const acc = express.Router();
const mongoose = require("mongoose");
const {
  add,
  accountList,
  deleteAccount,
  editAccount,
} = require("../controllers/AccountController");
const Account = require("../Models/Account");
const User = require("../Models/User");
const authenticator = require("../middleware/authenticator");
const { body, validationResult } = require("express-validator");

//creating account
acc.post(
  "/add",
  body("accName"),
  body("accType"),
  body("balance").isNumeric(),
  body("currency"),
  authenticator,
  add
);
//Getting account details by UserId
acc.get("/get", authenticator, accountList);
// Editing account details
acc.put(
  "/edit/:id",
  body("accName"),
  body("accType"),
  body("balance").isNumeric(),
  body("currency"),
  authenticator,
  editAccount
);
//deleteing account
acc.get("/delete/:aid", authenticator, deleteAccount);
module.exports = acc;
