const express = require("express");
const chart = express.Router();
const mongoose = require("mongoose");
const Record = require('../Models/Record')
const Account = require("../Models/Account");
const User = require("../Models/User");
const authenticator = require("../middleware/authenticator");
const { body, validationResult } = require("express-validator");
const {weekly} = require('../controllers/ChartController')

chart.get('/weekly', authenticator,weekly )

module.exports = chart