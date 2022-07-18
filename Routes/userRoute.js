require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const api = express.Router();
const mongoose = require("mongoose");
//!controller imports
const { register, login, profile } = require("../controllers/UserController");
const authenticator = require("../middleware/authenticator");


api.post("/login", login);
api.post("/register", register); 
api.get("/profile", authenticator, profile);



module.exports = api;
