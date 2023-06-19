const express = require("express");
const router = express.Router();
const auth=require("../auth/auth")
const memberController=require("../controller/member");


router.post('/v1/member',auth.auth,memberController.addMember);
router.delete('/v1/member/:id',auth.auth,memberController.deleteMember);


module.exports=router