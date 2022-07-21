require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

const login = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const user = await User.findOne({
      userName: req.body.name,
    });

    if (await bcrypt.compare(req.body.password, user.passWord)) {
      const token = jwt.sign(
        {
          userid: user._id,
          username: user.userName,
          email: user.email,
          password: user.passWord,
        },
        process.env.ACCES_TOKEN_SECRET
      );

      return res.json({ user: user, token: token });
    } else {
      return res.status(400).send({ status: "user not found" });
    }
  } catch (error) {
    res.json({ messege: error });
  }
};

const register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const hashPassword = await bcrypt.hash(req.body.pword, 10);
    const user = await User.create({
      userName: req.body.uname,
      fullName: req.body.fname,
      email: req.body.email,
      passWord: hashPassword,
    });
    res.json({ status: "ok", user: user });
  } catch (error) {
    if (error.keyPattern.email === 1) {
      return res.status(400).send({ error: "Email is already taken" });
    }
    res.status(500).send({ messege: "something went wrong" });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.user.username });
    if (user == null) {
      return res.status(400).send({message: "User doesn't exists"})
    }
    res.send({ user: user });
  } catch (error) {
    res.send({ messege: error });
  }
};

const logout = async(req,res) =>{


}
module.exports = { login, register, profile, logout };
