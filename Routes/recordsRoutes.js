const express = require("express");
const rec = express.Router();
const mongoose = require("mongoose");
const Record = require("../Models/Record");
const account = require("../Models/Account");
const { body, validationResult } = require("express-validator");

const authenticator = require('../middleware/authenticator')
const {
  add,
  RecordsbyAccount,
  RecordsbyUser,
  deleteRecord,
  editRecord,
} = require("../controllers/RecordController");
//adding a record
rec.post(
  "/:id/add",
  body("rType"),
  body("amount").isNumeric(),
  authenticator,
  add
);
//edit route
rec.put("/:id/edit", authenticator, editRecord)
//getting records by accountID
rec.get("/get/acc/:aid", authenticator, RecordsbyAccount);
//getting records by userID
rec.get("/get/user", authenticator, RecordsbyUser);
//Deletes a record by ID
rec.get("/del/:Id", authenticator, deleteRecord);

module.exports = rec;
