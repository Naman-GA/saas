const jwtDecode = require('jwt-decode');
const User=require("../models/userModel")

const auth = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return next( "UnAuthorized Access");
    }
    const token = authHeader.split(" ")[1];
      const data  = await jwtDecode(token);
      let user = await User.find({id:data.id})
      // console.log(user);
      req.user = {
        id:user[0].id,
        email: user[0].email,
        name:user[0].name,
      };
      // console.log(req.user);
      next();
    } catch (err) {
      console.log(err);
      return next("Unauthorized Access1");
    }
}
  module.exports.auth=auth;