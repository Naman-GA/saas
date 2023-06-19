const express = require("express");
const router = express.Router();
const auth=require("../auth/auth")
const communityController=require("../controller/community")


router.post('/v1/community',auth.auth,communityController.signin);
router.get('/v1/community',communityController.getall);
router.get('/v1/community/me/owner',auth.auth,communityController.getMyownerCommunity);
router.get('/v1/community/me/member',auth.auth,communityController.getMyJoinedCommunity);
router.get('/v1/community/:id/members',communityController.getAllmembers);


module.exports=router