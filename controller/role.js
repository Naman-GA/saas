const Role = require("../models/roleModel");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = new Role({
      name: name,
    });
    await newRole.save();
    res.json({
      status: true,
      content: {
        data: newRole,
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

exports.getAll = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // default limit is 10
  const page = parseInt(req.query.page) || 1; // default page is 1
  try {
    const count = await Role.countDocuments();
    const roles = await Role.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: roles.map((value) => ({
          id: value.id,
          name: value.name,
          scopes: value.scopes,
          created_at: value.created_at,
          updated_at: value.updated_at,
        })),
      },
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};
