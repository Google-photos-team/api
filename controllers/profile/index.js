const User = require("../../db/Schemas/user");
const bcrypt = require("bcryptjs");



// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

const getProfile = async (req, res, next) => {
  // TODO: get user profile using user_id
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "user not found" });
  }
  next();
};

const deleteProfile = async (req, res, next) => {
  // TODO: delete user profile using user_id
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user has been delete successfully" });
  } else {
    res.status(404).json({ message: "user not found" });
  }
  next();
};

const updateProfile = async (req, res, next) => {
  // TODO: update user profile using user_id
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
};

module.exports = {
  getProfile,
  deleteProfile,
  updateProfile,
};
