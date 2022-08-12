require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const User = require("../Models/User");
const Record = require("../Models/Record");
const { body, validationResult } = require("express-validator");

const add = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const acc = await Account.create({
      user: req.user.userid,
      accName: req.body.accName,
      accType: req.body.accType,
      balance: req.body.balance,
      currency: req.body.currency,
    });

    const user = await User.findOneAndUpdate(
      { _id: req.user.userid },
      {
        $push: { accounts: new mongoose.Types.ObjectId(acc._id) },
      },
      { new: true }
    );
    res.send({ status: "success", account: acc });
  } catch (error) {
    res.status(400).send({ messege: error });
  }
};

const accountList = async (req, res) => {
  try {
    const acc = await Account.find({
      user: req.user.userid,
    });
    res.send({ accounts: acc });
  } catch (error) {
    res.send({ messege: error });
  }
};

const editAccount =async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const acc = await Account.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          accName: req.body.accName,
          accType: req.body.accType,
          balance: req.body.balance,
          currency: req.body.currency,
        },
      },
      { new: true }
    );

    res.status(200).send({message:"Account Updated successfully", account: acc})
  } catch (error) {
    res.status(400).send({message:error})
  }
};

const deleteAccount = async (req, res) => {
  console.log(req.params.aid);
  try {
    const delacc = await Account.findByIdAndDelete({
      _id: req.params.aid,
    });
    console.log(delacc);
    if (!delacc) {
      res.status(404).send({ message: "Can not find account!" });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.user.userid },
      {
        $pull: { accounts: delacc._id },
      },
      { new: true, upsert: true }
    );
    console.log(user);

    const delrec = await Record.deleteMany({
      account: delacc._id,
    });
    console.log(delrec);
    res
      .status(200)
      .send({ status: "Accound Deleted", deleted_account: delacc, user: user });
  } catch (error) {
    res.status(400).send({ messege: error });
  }
};

module.exports = { add, accountList, deleteAccount, editAccount };
