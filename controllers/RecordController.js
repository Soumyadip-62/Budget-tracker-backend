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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const record = await Record.create({
      user: req.user.userid,
      account: req.params.id,
      rType: req.body.rType,
      amount: req.body.rType === "plus" ? req.body.amount : -req.body.amount,
      desc: req.body.desc,
      note:req.body.note,
      paymentType: req.body.paymentType,
      date: req.body.date,
    });

    const acc = await Account.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { records: new mongoose.Types.ObjectId(record._id) },

        // $set: { balance:  record.amount},
      },
      { new: true, upsert: true }
    );
    // let newBalance = acc.balance + record.amount;
    // if (newBalance > 0) {
      
      acc.balance = acc.balance + record.amount;
      await acc.save();
    // }
    // else{
    //   return res.status(403).send({error: "Account Balance Cannot be Less Than Zero!"})
    // }

    res.status(201).send({
      message: "success",
      added_record: record,
      account: acc,
    });
  } catch (error) {
    res.status(400).send({ messege: error });
  }
};

const RecordsbyAccount = async (req, res) => {
  console.log(req.params.aid);
  try {
    const record = await Record.find({
      account: req.params.aid,
    });
    const account = await Account.findOne({
      _id: req.params.aid,
    });
    res.status(200).send({account: account, records: record });
  } catch (error) {
    res.status(404).send({ messege: error });
  }
};

const RecordsbyUser = async (req, res) => {
  try {
    const record = await Record.find({
      user: req.user.userid,
    }).populate("account");
    res.status(200).send({ records: record });
  } catch (error) {
    res.status(404).send({ messege: error });
  }
};

const editRecord = async (req, res) => {
  console.log(req.params.id);
  try {
    const rec = await Record.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          rType: req.body.rType,
          amount:
            req.body.rType === "plus" ? req.body.amount : -req.body.amount,
          desc: req.body.desc,
          note:req.body.note,
          paymentType: req.body.paymentType,
          date: req.body.date,
        },
      }
    );
    // if (rec.amount !== req.body.amount || rec.rType !== rec.body.rType) {
      console.log( "account id =",rec.account);
      const acc = await Account.findOne({ _id: rec.account });
      acc.balance = acc.balance - rec.amount + (req.body.rType ==="minus"? -req.body.amount : req.body.amount);
      await acc.save();
      console.log(acc);
    // }
    
    res.status(200).send({ message: "Successfully Updated Record"  });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
const deleteRecord = async (req, res) => {
  try {
    const del = await Record.findByIdAndDelete({
      _id: req.params.Id,
    });
    if (!del) {
      res.status(404).send({ message: "Can not find account!" });
    }
    console.log(del);
    // const newrecord = await Record.aggregate([
    //   { $match: { account: del.account} },
    //   { $group: { _id: "$records", total: { $sum: "$amount" } } },
    // ]);
    // console.log(newrecord);
    const acc = await Account.findOneAndUpdate(
      { _id: del.account },
      {
        $pull: { records: del._id },
        // $set: { balance: newrecord[0].total },
      },
      { new: true, upsert: true }
    );
    console.log(acc);
    acc.balance = acc.balance - del.amount;
    await acc.save();
    res
      .status(200)
      .send({ status: "Deleted", deleted_record: del, account: acc });
  } catch (error) {
    res.status(404).send({ messege: error });
  }
};
module.exports = {
  add,
  RecordsbyAccount,
  RecordsbyUser,
  deleteRecord,
  editRecord,
};
