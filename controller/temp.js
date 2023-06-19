//     const communityid=req.body.community;
//     const userid=req.body.user;
//     const role=req.body.role;

//     console.log(communityid,userid,role);


//     let authHeader = req.headers.authorization;
//     const token = authHeader.split(" ")[1];
//     const data  = await jwtDecode(token);
//     const adminid=data.id;
    
//     console.log(adminid);

//     const communitie = await Community.findOne({id:communityid});

//     console.log(communitie);

//     if(!communitie){
//         return res.json({
//             status: false,
//             errors: 
//                 [{
//                 param: "community",
//                 message: "Community not found.",
//                 code: "RESOURCE_NOT_FOUND"
//                 }] 
//         })
//     }
//     const userValidate = await User.findOne({id:userid});
//     console.log(userValidate);

//     const roleValidate = await Role.findOne({id:role});
//     console.log(roleValidate);

//     console.log(adminid,communitie.owner);
//     if(adminid!=communitie.owner){
//         return res.json({
//             status: false,
//             errors: 
//                 [{
//                     message: "You are not authorized to perform this action.",
//                     code: "NOT_ALLOWED_ACCESS"
//                 }] 
//         })
//     }

//     const memberAlready=await member.findOne({user:userid,community:communityid})
//     if(memberAlready){
//             return res.json({
//                 status: false,
//                 errors: 
//                     [{
//                     param: "user",
//                     message: "User already exist.",
//                     code: "RESOURCE_NOT_FOUND"
//                     }] 
//             })
//         }
//         if(!userValidate){
//             return res.json({
//                 status: false,
//                 errors: 
//                     [{
//                     param: "user",
//                     message: "User not found.",
//                     code: "RESOURCE_NOT_FOUND"
//                     }] 
//             })
//         }
//         if(!roleValidate){
//             return res.json({
//                 status: false,
//                 errors: 
//                     [{
//                     param: "role",
//                     message: "Role not found.",
//                     code: "RESOURCE_NOT_FOUND"
//                     }] 
//             })
//         }
//         const newMember=new member({
//             community:communityid,
//             user:userid,
//             role:role,
//         })
//         await newMember.save();
//         return res.json({
//             status: true,
//             content: {
//             data: {
//             newMember}
//   }
//         })