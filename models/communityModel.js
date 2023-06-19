const mongoose = require('mongoose');
const { Snowflake } =require("@theinternetfolks/snowflake");

const CommunityModel = new mongoose.Schema({
  id: {
    type: String,
    default: Snowflake.generate
  },
  name: {
    type: String,
    minlength: [2,'Name should be at least 2 characters.']
  },
  slug: {
    type: String,
    min: 1,
    max: 255,
    unique: true
  },
  owner: {
    type:String,
    ref: "USERSCHEMA"
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("COMMUNITYSCHEMA", CommunityModel)