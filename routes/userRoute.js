const express = require("express");
const router = express.Router();
const auth=require("../auth/auth")
const userController=require("../controller/user")

router.post("/v1/auth/signup",userController.signup);
router.post("/v1/auth/signin",userController.signin);
router.get("/v1/auth/me",userController.getme);

module.exports=router