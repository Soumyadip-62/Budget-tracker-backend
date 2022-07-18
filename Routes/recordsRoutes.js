const express = require("express");
const rec = express.Router();
const mongoose = require("mongoose");
const Record = require("../Models/Record");
const account = require("../Models/Account");
const {
  add,
  RecordsbyAccount,
  RecordsbyUser,
  deleteRecord,
} = require("../controllers/RecordController");

//adding a record
rec.post("/add", add);
//getting records by accountID
rec.post("/get/acc/:aid", RecordsbyAccount);
//getting records by userID
rec.post("/get/user/:uid", RecordsbyUser);
//Deletes a record by ID
rec.post("/del/:Id", deleteRecord);

module.exports = rec;
