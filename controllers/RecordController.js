require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const User = require("../Models/User");
const Record = require("../Models/Record");

const add = async (req, res) => {
  const rtype = req.body.rType;
  console.log(req.user.userid);
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
    res.send(record);
  } catch (error) {
    res.send({ messege: error });
  }
};

const RecordsbyUser = async (req, res) => {
  console.log(req.params.aid);
  try {
    const record = await Record.find({
      user: req.params.uid,
    });
    res.json(record);
  } catch (error) {
    res.send({ messege: error });
  }
};

const deleteRecord = async (req, res) => {
  console.log(req.params.Id);
  try {
    const del = await Record.findByIdAndDelete({
      _id: req.params.Id,
    });
    res.send({ status: 200 });
  } catch (error) {
    res.send({ messege: error });
  }
};
module.exports = { add, RecordsbyAccount, RecordsbyUser, deleteRecord };
