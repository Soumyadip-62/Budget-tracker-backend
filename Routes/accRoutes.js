const express = require("express");
const acc = express.Router();
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const User = require("../Models/User");
//creating account
acc.post("/add", async (req, res) => {
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
});
//Getting account details by UserId
acc.get("/get/:uid", async (req, res) => {

  console.log( req.headers.authorization)
  try {
    const acc = await Account.find({
      user: req.params.uid,
    });
    res.send({accounts:acc});
  } catch (error) {
    res.send({ messege: error });
  }
});
//deleteing account
acc.post("/del/:aid", async (req, res) => {
  try {
    const delacc = await Account.deleteOne({
      _id: req.params.aid,
    });
    res.send({ status: "Accound Deleted" });
  } catch (error) {
    res.send({ messege: error });
  }
});
module.exports = acc;
