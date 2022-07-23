require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Whitelist = require("../Models/Whitelist");
const authenticator = async (req, res, next) => {
  const authheader = req.headers.authorization;
  // console.log(authheader);
  const token = authheader && authheader.split(" ")[1];
  if (token === null) {
    return res.status(401).send("Token not found");
  }
  const WhitelistedToken = await Whitelist.findOne({ token: token });
  if (WhitelistedToken) {
    jwt.verify(WhitelistedToken.token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "UnAuthenticated", error: err });
      }
      req.user = user;
      req.token = WhitelistedToken.token;
      next();
    });
  } else{
    res.status(422).send({message: "Invalid Token or Token Has Expired"})
  }
};

module.exports = authenticator;
