const express = require("express");
const router = express.Router();
const roleController=require("../controller/role")

router.post("/v1/role",roleController.create);
router.get("/v1/role",roleController.getAll)

module.exports=router