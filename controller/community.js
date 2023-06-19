const Community = require("../models/communityModel");
const User = require("../models/userModel");
const member = require("../models/memberModel");
const Role = require("../models/roleModel");
const jwtDecode = require("jwt-decode");

exports.signin = async (req, res) => {
  try {
    const communityAdminRole = await Role.findOne({ name: "community admin" });
    let authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const data = await jwtDecode(token);
    console.log(communityAdminRole, "nytj");
    const newCommunity = new Community({
      name: req.body.name,
      slug: req.body.name.toLowerCase(),
      owner: data.id,
    });
    await newCommunity.save();
    const newMember = new member({
      community: newCommunity.id,
      user: newCommunity.owner,
      role: communityAdminRole.id,
    });
    await newMember.save();
    res.json({
      status: true,
      content: {
        data: newCommunity,
      },
    });
  } catch (error) {
    const errors = [];

    // Check for validation error
    if (error.name === "ValidationError") {
      for (let field in error.errors) {
        errors.push({
          param: field,
          message: error.errors[field].message,
          code: "INVALID_INPUT",
        });
      }
    } else {
      // Handle other types of errors
      errors.push({
        message: error.message,
        code: "SERVER_ERROR",
      });
    }

    res.status(400).json({
      status: false,
      errors: errors,
    });
  }
};

exports.getall = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // default limit is 10
  const page = parseInt(req.query.page) || 1; // default page is 1
  try {
    const count = await Community.countDocuments();
    const communities = await Community.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const ownerIds = communities.map((community) => community.owner);
    const owners = await User.find({ id: { $in: ownerIds } }, "id name");

    const ownerMap = new Map();
    owners.forEach((owner) => {
      ownerMap.set(owner.id.toString(), {
        id: owner.id.toString(),
        name: owner.name,
      });
    });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: communities.map((community) => ({
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: ownerMap.get(community.owner.toString()) || {}, // Retrieve owner details from the map
          created_at: community.created_at,
          updated_at: community.updated_at,
        })),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error occurred while retrieving communities.",
    });
  }
};

exports.getMyownerCommunity = async (req, res) => {
  let authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const data = await jwtDecode(token);
  const adminid = data.id;
  const limit = parseInt(req.query.limit) || 10; // default limit is 10
  const page = parseInt(req.query.page) || 1; // default page is 1
  try {
    const communitie = await Community.find({ owner: adminid })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await Community.countDocuments({ owner: adminid });
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: communitie.map((value) => ({
          id: value.id,
          name: value.name,
          slug: value.slug,
          owner: value.owner,
          created_at: value.created_at,
          updated_at: value.updated_at,
        })),
      },
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getMyJoinedCommunity = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // default limit is 10
  const page = parseInt(req.query.page) || 1; // default page is 1
  try {
    let authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const data = await jwtDecode(token);
    const userid = data.id;
    const joined = await member.find({ user: userid });
    const communityIds = joined.map((member) => member.community);

    // Query the community model using the community IDs
    const communities = await Community.find({ id: { $in: communityIds } })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = communities.length;
    //const communities = await Community.find({id:joined.community})
    const ownerIds = communities.map((community) => community.owner);
    const owners = await User.find({ id: { $in: ownerIds } }, "id name");

    const ownerMap = new Map();
    owners.forEach((owner) => {
      ownerMap.set(owner.id.toString(), {
        id: owner.id.toString(),
        name: owner.name,
      });
    });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: communities.map((community) => ({
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: ownerMap.get(community.owner.toString()) || {}, // Retrieve owner details from the map
          created_at: community.created_at,
          updated_at: community.updated_at,
        })),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllmembers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // default limit is 10
  const page = parseInt(req.query.page) || 1;
  const communityName = req.params.id;
  // console.log(communityName);
  const communityid = await Community.findOne({ name: communityName });
  // console.log(communityid);
  const details = await member
    .find({ community: communityid.id })
    .skip((page - 1) * limit)
    .limit(limit);

  const count = details.length;
  const roleIds = details.map((member) => member.role);
  const roles = await Role.find({ id: { $in: roleIds } }, "id name");

  const roleMap = new Map();
  roles.forEach((r) => {
    roleMap.set(r.id.toString(), {
      id: r.id.toString(),
      name: r.name,
    });
  });

  const userIds = details.map((member) => member.user);
  const users = await User.find({ id: { $in: userIds } }, "id name");

  const userMap = new Map();
  users.forEach((r) => {
    userMap.set(r.id.toString(), {
      id: r.id.toString(),
      name: r.name,
    });
  });
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
        page: page,
      },
      data: details.map((detail) => ({
        id: detail.id,
        community: detail.community,
        user: userMap.get(detail.user.toString()) || {},
        role: roleMap.get(detail.role.toString()) || {}, // Retrieve owner details from the map
        created_at: detail.created_at,
      })),
    },
  });
};
