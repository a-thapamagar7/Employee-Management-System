const mongoose = require("mongoose")

const Users = new mongoose.Schema({
    name: { type: String },
    email: { type: String},
    password: { type: String}

}, { collection: "user-data" })

const noteModel = mongoose.model("UserData", Users)

module.exports = noteModel