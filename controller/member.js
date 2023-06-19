const Community = require("../models/communityModel");
const auth=require("../auth/auth");
const User=require("../models/userModel");
const jwtDecode = require('jwt-decode');
const member=require("../models/memberModel");
const Role=require("../models/roleModel");


exports.addMember=async(req,res)=>{
    try {
        const { community, user, role } = req.body;
        
        console.log(community, user, role);
      
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const data = await jwtDecode(token);
        const adminid = data.id;
      
        console.log(adminid);
      
        const [communitie, userValidate, roleValidate] = await Promise.all([
          Community.findOne({ id: community }),
          User.findOne({ id: user }),
          Role.findOne({ id: role })
        ]);
      
        console.log(communitie);
        console.log(userValidate);
        console.log(roleValidate);
      
        console.log(adminid, communitie.owner);
      
        if (!communitie || !userValidate || !roleValidate) {
          const errors = [];
          if (!communitie) {
            errors.push({ param: "community", message: "Community not found.", code: "RESOURCE_NOT_FOUND" });
          }
          if (!userValidate) {
            errors.push({ param: "user", message: "User not found.", code: "RESOURCE_NOT_FOUND" });
          }
          if (!roleValidate) {
            errors.push({ param: "role", message: "Role not found.", code: "RESOURCE_NOT_FOUND" });
          }
      
          return res.json({ status: false, errors });
        }
      
        if (adminid !== communitie.owner) {
          return res.json({
            status: false,
            errors: [{
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS"
            }]
          });
        }
      
        const memberCount = await member.countDocuments({ user: user, community: community });
        if (memberCount > 0) {
          return res.json({
            status: false,
            errors: [{
              param: "user",
              message: "User already exists.",
              code: "RESOURCE_ALREADY_EXISTS"
            }]
          });
        }
      
        const newMember = new member({
          community: community,
          user: user,
          role: role
        });
        await newMember.save();
      
        return res.json({
          status: true,
          content: {
            data: {
              newMember
            }
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error." });
      }
    }

    exports.deleteMember=async(req,res)=>{
      try{
        const memberId = req.params.id;
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const data = await jwtDecode(token);
        const adminid = data.id; 
        const memb = await member.findOne({ id:memberId });
// Check if the member exists
if (!memb) {
  return res.status(404).json({ 
  status: false, 
  errors: [
    {
      message: "Member not found.",
      code: "RESOURCE_NOT_FOUND"
    }
  ]
});
}

// Fetch the community information separately
const community = await Community.findOne({id:memb.community});
// Check if the user is an admin or moderator
if (
  community.owner.toString() !== adminid) {
  return res
    .status(403)
    .json({ status: false, message: "You don't have permission to delete this member" });
  }
// Delete the member by ID
  const d=await member.deleteOne({id:memberId});
  if(d){
    return res.json({
      status:true
    })
  }
      }
      catch(error){
        res.json({error})
      }
    }
    