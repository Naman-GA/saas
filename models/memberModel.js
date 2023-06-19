const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');


const memberSchema=new mongoose.Schema({
    id:{
        type:String,
        default: Snowflake.generate
    },
    community:{
        type:String,
        ref:"COMMUNITYSCHEMA"
    },
    user:{
        type:String,
        ref:"USERSCHEMA"
    },
    role:{
        type:String,
        ref:"ROLE"
    },
    created_at:{
        type:Date,
        default:new Date()
    }
})

module.exports=mongoose.model("member",memberSchema)


