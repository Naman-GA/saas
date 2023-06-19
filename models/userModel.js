const mongoose = require('mongoose');
const { Snowflake } =require("@theinternetfolks/snowflake");

const UserModel = new mongoose.Schema({
    id: {
        type: String,
        default:Snowflake.generate,
        primary:true
    },
    name: {
        type: String,
        minlength: [2,"Name should be at least 2 characters."],
        max: 64,
        default: null,
    },
    email: {
        type: String,
        min: 1,
        max: 128,
        unique: true,
        required:true
    },
    password: {
        type: String,
        min: [6,"Password should be at least 6 characters."],
        max: 64,
        required:true
    },
    created_at: {
        type: Date,
        default: new Date(),
    }
})

module.exports = mongoose.model("USERSCHEMA", UserModel)