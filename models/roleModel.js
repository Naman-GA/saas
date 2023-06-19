const mongoose = require('mongoose');
const { Snowflake } =require("@theinternetfolks/snowflake");

const RoleSchema = new mongoose.Schema({
  id: {
    type: String,
    default:Snowflake.generate
  },
  name: {
    type: String,
    minlength: [2,'Name should be at least 2 characters.'],
    maxlength: 64
  },
  scopes:[],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("ROLE", RoleSchema)