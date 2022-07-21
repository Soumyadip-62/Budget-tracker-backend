require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const { body, validationResult } = require("express-validator");

const User = require("../Models/User");

const Record = require("../Models/Record");

const add = async (req, res) => {
  const rtype = req.body.rType;
  console.log(req.user.userid);
 const errors = validationResult(req)
 if (!errors.isEmpty()) {
   return res.status(400).json({
     success: false,
     errors: errors.array(),
   });
 }
  try {
    const record = await Record.create({
      user: req.user.userid,
      account: req.body.account,
      rType: req.body.rType,
      amount: req.body.rType === "plus" ? req.body.amount : -req.body.amount,
      desc: req.body.desc,
      paymentType: req.body.paymentType,
      date: req.body.date,
    });
   
    const newrecord = await Record.aggregate([
      { $match: { account: new mongoose.Types.ObjectId(record.account) } },
      { $group: { _id: "$records", total: { $sum: "$amount" } } },
    ]);
    // console.log(newrecord);
    const acc = await Account.findOneAndUpdate(
      { _id: req.body.account },
      {
        $push: { records: new mongoose.Types.ObjectId(newrecord._id) },
        $set: { balance: newrecord[0].total },
      },
      { new: true, upsert: true }
    );
    // acc.balance = newrecord[0].total;
    // await acc.save();
   

    res.status(201).send({
      message: "success",
      added_record: record,
      account: acc,
    });
  } catch (error) {
    res.status(400).send( { messege: error });
  }
};

const RecordsbyAccount = async (req, res) => {
  console.log(req.params.aid);
  try {
    const record = await Record.find({
      account: req.params.aid,
    });
    res.status(200).send({records : record});
  } catch (error) {
    res.status(404).send({ messege: error });
  }
};

const RecordsbyUser = async (req, res) => {
  try {
    const record = await Record.find({
      user: req.user.userid,
    });
    res.status(200).send({records : record});
  } catch (error) {
    res.status(404).send({ messege: error });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const del = await Record.findByIdAndDelete({
      _id: req.params.Id,
    });
    res.status(200).send({ status: "Deleted" });
  } catch (error) {
    res.status(404).send({ messege: error });
  }
};
module.exports = { add, RecordsbyAccount, RecordsbyUser, deleteRecord };
