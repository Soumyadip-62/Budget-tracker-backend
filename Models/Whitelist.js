const mongoose = require("mongoose");

const Whitelist = mongoose.Schema({
    token:{
        type:String,
        required:true
    }
})

const model = mongoose.model("Whitelist", Whitelist); //creating a new model User, and the name of the collection/table is user-data

module.exports = model;
