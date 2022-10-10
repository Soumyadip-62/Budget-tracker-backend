require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const User = require("../Models/User");
const Record = require("../Models/Record");
// const Account = require('../Models/Account')
const { body, validationResult } = require("express-validator");
const categories = [
  "Food & Drinks",
  "Shopping",
  "Housing",
  "Transportaion",
  "Vehicle",
  "Enetertainment",
  "Electronics",
  "Financial Expenses",
  "Self Care",
  "Income",
  "Others",
];

const monthly = async (req, res) => {
  var curr = new Date(); // get current date
  var month = curr.getMonth();
  // var first = curr.getDate() - curr.getDay();
  var first = 1; // First day is the day of the month - the day of the week
  var last = curr.getDate(); //first +6; // last day is the first day + 6
  console.log(first, last, month);
  try {
    const records = await Record.find({
      user: req.user.userid,
      date: {
        $gte: new Date(curr.setDate(first)),
        $lt: new Date(curr.setDate(last)),
      },
      rType: "plus",
    });

    return res.send({ records: records, month: month });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};
const monthlyExpence = async (req, res) => {
  var curr = new Date(); // get current date
  var month = curr.getMonth();
  // var first = curr.getDate() - curr.getDay();
  var first = 1; // First day is the day of the month - the day of the week
  var last = curr.getDate(); //first +6; // last day is the first day + 6
  console.log(first, last, month);
  try {
    const records = await Record.find({
      user: req.user.userid,
      date: {
        $gte: new Date(curr.setDate(first)),
        $lt: new Date(curr.setDate(last)),
      },
      rType: "minus",
    });

    return res.send({ records: records, month: month });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};
const cashflow = async (req, res) => {
  var curr = new Date(); // get current date
  var month = curr.getMonth();
  // var first = curr.getDate() - curr.getDay();
  var first = 1; // First day is the day of the month - the day of the week
  var last = curr.getDate(); //first +6; // last day is the first day + 6
  console.log(first, last, month);
  try {
    const records = await Record.find({
      user: req.user.userid,
      date: {
        $gte: new Date(curr.setDate(first)),
        $lt: new Date(curr.setDate(last)),
      },
    });
    let total_expense = 0;
    let total_income = 0;

    let expense = records.filter((rec) => rec.rType === "minus");
    let income = records.filter((rec) => rec.rType === "plus");

    expense.forEach((ex) => {
      total_expense = total_expense + ex.amount;
    });

    income.forEach((inc) => {
      total_income = total_income + inc.amount;
    });

    res.send({
      total_income: total_income,
      total_expense: total_expense,
      month: month,
    });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};

//chart by category
const category = async (req, res) => {
  var curr = new Date(); // get current date
  var month = curr.getMonth();
  // var first = curr.getDate() - curr.getDay();
  var first = 1; // First day is the day of the month - the day of the week
  var last = curr.getDate(); //first +6; // last day is the first day + 6
  console.log(first, last, month);
  try {
    const records = await Record.find({
      user: req.user.userid,
      date: {
        $gte: new Date(curr.setDate(first)),
        $lt: new Date(curr.setDate(last)),
      },
      // rType: "minus",
    });
    let categoryData= []

    
    for (let index = 0; index < categories.length; index++) {
      
     let total_amount =0 ;
     let filtered =  records.filter(rec=> rec.desc === categories[index] )
     filtered.forEach(fil => {
      total_amount = total_amount + fil.amount
     })
      categoryData.push({
        category_name: categories[index],
        total: total_amount
      })
    //  Object.assign(categoryData, {
    //     [categories[index]] : total_amount
    //   })
    }
    return res.send({ records: categoryData, month: month });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};

// last month expences
const lastMonthExpence = async (req, res) => {
  var curr = new Date(); // get current date
  var month = curr.getMonth();
var prev = new Date(curr.setMonth(month - 1));

  // var first = curr.getDate() - curr.getDay();
  var first = 1; // First day is the day of the month - the day of the week
  var last = 31 //first +6; // last day is the first day + 6
  console.log(first, last, prev);
  try {
    const records = await Record.find({
      user: req.user.userid,
      date: {
        $gte: new Date(prev.setDate(first)),
        $lt: new Date(prev.setDate(last)),
      },
      // rType: "minus",
    });
    const labels= records.map(rec=> {return new Date(rec.date).toDateString()})
    const incomes = records.filter(rec=> rec.rType === "plus")
    const expenses = records.filter(rec=> rec.rType === "minus")

    return res.send({records:records, labels: labels, month: prev.getMonth() -1 });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};
//accounts chart
const accountChart =async (req, res)=>{
    try {
      const acc = await Account.find({
        user: req.user.userid,
      });
      let data = [];

      acc.forEach(acc => {
        // Object.assign(data, {[acc.accName] : acc.balance})
        data.push({name: acc.accName , balance: acc.balance, type: acc.accType})
      });
      res.send({ accounts: data });
    } catch (error) {
      res.status(404).send({ error: error });
    }
}
module.exports = {
  monthly,
  monthlyExpence,
  cashflow,
  category,
  lastMonthExpence,
  accountChart
};
