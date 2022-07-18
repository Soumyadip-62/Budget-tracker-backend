const express = require("express");
const rec = express.Router();
const mongoose = require("mongoose");
const { findByIdAndDelete } = require("../Models/Record");
const Record = require("../Models/Record");
const account = require("../Models/Account");
const req = require("express/lib/request");

//adding a record
rec.post("/add", async (req, res) => {
  const rtype = req.body.rType;
  try {


    const record = await Record.create({
      user: req.body.user,
      account: req.body.account,
      rType: req.body.rType,
      amount: req.body.rType === "plus" ? req.body.amount : -req.body.amount,
      desc: req.body.desc,
      paymentType: req.body.paymentType,
      date: req.body.date,
    });

    const newrecord = await Record.aggregate([
      { $match: { account: new mongoose.Types.ObjectId(req.body.account) } },
      { $group: { _id: "$records", total: { $sum: "$amount" } } },
    ]);
    console.log(newrecord);
    const acc = await account
      .findOneAndUpdate(
        { _id: req.body.account },
        {
          $push: { records: new mongoose.Types.ObjectId(newrecord._id) },
          $set: { balance: newrecord[0].total },
        },
        { new: true, upsert:true },
        
      )
    // acc.balance = newrecord[0].total;
    // await acc.save();
    console.log(acc);
   
    res.status(201).send({
      message: "success",
      added_record: record,
      account : acc
    });
  } catch (error) {
    
    res.send(500, { messege: error });
  }
});
//getting records by accountID
rec.post("/get/acc/:aid", async (req, res) => {
  console.log(req.params.aid);
  try {
    const record = await Record.find({
      account: req.params.aid,
    });
    res.send(record);
  } catch (error) {
    res.send({ messege: error });
  }
});
//getting records by userID
rec.post("/get/user/:uid", async (req, res) => {
  console.log(req.params.aid);
  try {
    const record = await Record.find({
      user: req.params.uid,
    });
    res.json(record);
  } catch (error) {
    res.send({ messege: error });
  }
});
//Deletes a record by ID
rec.post("/del/:Id", async (req, res) => {
  console.log(req.params.Id);
  try {
    const del = await Record.findByIdAndDelete({
      _id: req.params.Id,
    });
    res.send({ status: 200 });
  } catch (error) {
    res.send({ messege: error });
  }
});

rec.post('/delete', async (req,res) => {
  try {
    const del = await Record.deleteMany({ amount: req.body.amount });
    res.json(200, { deleted: del });
  } catch (error) {
    res.send({message : error})
  }
  
})

module.exports = rec;
