require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Account = require("../Models/Account");
const User = require("../Models/User");
const Record = require("../Models/Record");
const { body, validationResult } = require("express-validator");


const weekly = async(req,res)=>{
    function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    }
 function formatDate(date) {
      return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join("-");
    }

    // 👇️ 2022-01-18 (yyyy-mm-dd)
    const date = formatDate(new Date());
    console.log();
    console.log(date);
    try {
        const records = await Record.find({
          user: req.user.userid,
          date: date + "T00:00:00.000+00:00",
        });

        return res.send({records: records})
        
    } catch (error) {
        res.status(404).send({error:error})
    }

}

module.exports = {
    weekly
}