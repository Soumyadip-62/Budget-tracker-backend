require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const api = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
//!controller imports
const {
  register,
  login,
  profile,
  logout,
  editProfile,
  changePassword,
  forgetPassword,
  resetPassword,
  dashboard,
} = require("../controllers/UserController");
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
api.put("/edit_profile", authenticator, editProfile);
api.put(
  "/change_password",
  body("password").isLength({
    min: 6,
  }),
  body("new_password1").isLength({
    min: 6,
  }),
  body("new_password2").isLength({
    min: 6,
  }),
  authenticator,
  changePassword
);
api.get("/logout", authenticator, logout);
api.post(
  "/forgotpassword",
  body("email").isEmail().normalizeEmail(),
  forgetPassword
);
api.post(
  "/resetpassword",
  body("new_password1").isLength({
    min: 6,
  }),
  body("new_password2").isLength({
    min: 6,
  }),
  resetPassword
);
api.get('/dashboard', authenticator,dashboard)

module.exports = api;
