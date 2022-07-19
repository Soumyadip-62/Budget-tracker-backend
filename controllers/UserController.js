require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const login = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      userName: req.body.name,
    });

    if (await bcrypt.compare(req.body.password, user.passWord)) {
      const token = jwt.sign(
        { 
          userid:user._id,
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
    res.status(500).send("something went wrong");
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.user.username });
    res.send({ user: user });
  } catch (error) {
    res.send({ messege: error });
  }
};

module.exports = { login, register, profile };
