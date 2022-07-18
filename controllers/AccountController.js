require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const User = require("../Models/User");

const add = async (req, res) => {
  console.log(req.body);
  try {
    const acc = await Account.create({
      user: req.body.user,
      accName: req.body.accName,
      accType: req.body.accType,
      balance: req.body.balance,
      currency: req.body.currency,
    });

    const user = await User.findOneAndUpdate(
      { _id: req.body.user },
      {
        $push: { accounts: new mongoose.Types.ObjectId(acc._id) },
      },
      { new: true }
    );
    res.send({ status: "success", account: acc, updateduser: user });
  } catch (error) {
    res.send({ messege: error });
  }
};

const accountList = async (req, res) => {
  console.log(req.headers.authorization);
  try {
    const acc = await Account.find({
      user: req.params.uid,
    });
    res.send({ accounts: acc });
  } catch (error) {
    res.send({ messege: error });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const delacc = await Account.deleteOne({
      _id: req.params.aid,
    });
    res.send({ status: "Accound Deleted" });
  } catch (error) {
    res.send({ messege: error });
  }
}

module.exports = { add, accountList, deleteAccount}