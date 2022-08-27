require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Whitelist = require("../Models/Whitelist");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");

// mail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.emailUser,
    pass: process.env.emailPassword,
  },
});

let MailOtp;

// !login
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
      email: req.body.email,
    }).select("+passWord");
if (!user) {
  return res.status(400).send({error:"User does not exist"})
}
    if (await bcrypt.compare(req.body.password, user.passWord)) {
      const token = jwt.sign(
        {
          userid: user._id,
          username: user.userName,
          email: user.email,
          password: user.passWord,
        },
        process.env.ACCES_TOKEN_SECRET,
        {
          expiresIn: "7d", // expires in 7 days
        }
      );
      // console.log(token);
      await Whitelist.create({
        token: token,
      }).then((res) => console.log(res));
      return res.json({
        user: {
          _id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          accounts: user.accounts,
        },
        token: token,
      });
    } else {
      return res.status(400).send({ error: "Password Mismatch" });
    }
  } catch (error) {
    res.status(400).json({ messege: error });
  }
};

// !register
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
    res.status(400).send({ messege: "something went wrong" });
  }
};

// !profile route
const profile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userid });
    if (user == null) {
      return res.status(400).send({ message: "User doesn't exists" });
    }
    res.send({ user: user });
  } catch (error) {
    res.send({ messege: error });
  }
};

//! edit profile
const editProfile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.user.userid,
      },
      {
        $set: { userName: req.body.uname, fullName: req.body.fname },
      },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .send({ message: "Profile Updated successfully", user: user });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//! change password
const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    if (await bcrypt.compare(req.body.password, req.user.password)) {
      if (req.body.new_password1 !== req.body.new_password2) {
        res.status(400).send({ message: "Passwords doesn't match" });
      }
      const hashPassword = await bcrypt.hash(req.body.new_password2, 10);
      const user = await User.findOneAndUpdate(
        {
          _id: req.user.userid,
        },
        {
          $set: { passWord: hashPassword },
        },
        { new: true, upsert: true }
      );
      const token = jwt.sign(
        {
          userid: user._id,
          username: user.userName,
          email: user.email,
          password: user.passWord,
        },
        process.env.ACCES_TOKEN_SECRET,
        {
          expiresIn: "7d", // expires in 7 days
        }
      );
      const blackListedtoken = await Whitelist.findOneAndDelete({
        token: req.token,
      });
      // console.log(token);
      await Whitelist.create({
        token: token,
      }).then((res) => console.log(res));
      res.status(200).send({
        message: "Password Updated successfully",
        user: {
          _id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          accounts: user.accounts,
        },
        token: token,
      });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//! logout
const logout = async (req, res) => {
  // console.log("token from req",req.token);
  try {
    const token = await Whitelist.findOneAndDelete({ token: req.token });
    // console.log("token",token);
    if (token) {
      res.status(200).send({ message: "Logged out successfully!" });
    } else {
      res.send("something went wrong");
    }
  } catch (error) {
    res.send(422, { error: error });
  }
};

// ! forget  password
const forgetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  let email = req.body.email;
  if (!email) {
    res.status(400).send({ error: "Email is required" });
  }
  const user = await User.findOne({
    email: email,
  });
  const code = Math.floor(Math.random() * (99999 - 10000)) + 10000;

  if (user) {
    try {

     

      (mailOptions = {
        from: "soumyadippandit2@gmail.com",
        to: email,
        subject: "Reset Password mail from Budget Tracker",
        html: `<h2>Welcome To Budget Tracker</h2><br/><h1>${code}</h1><br/> <h3>is your Otp to change your pasword</h3>`,
      }),
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            res.status(404).send({ error: error });
          } else {
            console.log("Email sent: " + info.response);
            const user = await User.findOneAndUpdate(
              {
                email: email,
              },
              {
                $set: { secretOtp: code },
              },
              { new: true }
            );

            res.status(200).send({
              message: "Mail sent to: " + mailOptions.to + " With Otp",
            });
          }
        });
    } catch (error) {
      res.status(404).send({ error: error });
    }
  }
  else{
    res.status(404).send({
      error: "Email is not registered!"
    })
  }
};

// !reset password
const resetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  if (req.body.new_password1 !== req.body.new_password2) {
   return res.status(402).send({ error: "Passwords doesn't match" });
  }
  try {
    const hashPassword = await bcrypt.hash(req.body.new_password2, 10);
    const user = await User.findOne({
      secretOtp: req.body.otp,
    });
    if (user) {
      user.passWord = hashPassword;
      user.secretOtp = null;
      await user.save();
      res.status(200).send({ message: "Password Updated Succesfully!" });
    } else {
      res.status(404).send({ error: "Invalid Otp" });
    }
  } catch (error) {
    res.status(404).send({ error: error });
  }
};

// !dashboard
// TODO:create dashboard fucntion
const dashboard = async(req,res)=>{

}
//* exports
module.exports = {
  login,
  register,
  profile,
  logout,
  editProfile,
  changePassword,
  forgetPassword,
  resetPassword,
  dashboard
};
