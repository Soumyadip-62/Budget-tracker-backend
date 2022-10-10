const express = require("express");
const chart = express.Router();
const mongoose = require("mongoose");
const Record = require('../Models/Record')
const Account = require("../Models/Account");
const User = require("../Models/User");
const authenticator = require("../middleware/authenticator");
const { body, validationResult } = require("express-validator");
const {monthly, monthlyExpence, cashflow, category, lastMonthExpence, accountChart} = require('../controllers/ChartController')

chart.get('/monthly/income', authenticator,monthly) //done
chart.get("/monthly/expense", authenticator, monthlyExpence);//done
chart.get('/cashflow', authenticator, cashflow)//done
// chart.get('/lastmonth/income', authenticator, );
chart.get('/bycategory', authenticator, category)
chart.get('/byaccount', authenticator,accountChart)//done
chart.get("/lastmonth/expense", authenticator, lastMonthExpence);//done



module.exports = chart