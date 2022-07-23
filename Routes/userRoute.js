require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const api = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
//!controller imports
const { register, login, profile, logout } = require("../controllers/UserController");
const authenticator = require("../middleware/authenticator");


api.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({
    min: 6,
  }),
  login
);
api.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("pword").isLength({
    min: 6,
  }),
  register
); 
api.get("/profile", authenticator, profile);
api.get("/logout", authenticator, logout)



module.exports = api;
