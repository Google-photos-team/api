const { RESPONSE_STATUS_USER } = require("../../constants/status");
const User = require("../../db/Schemas/user");
const bcrypt = require("bcryptjs");

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
//getProfile
const getProfile = async (req, res, next) => {
  // TODO: get user profile using user_id
  try {
    const { user_id } = req;
    const user = await User.findById(user_id).select("-password").populate({path:"profile"});
    res.status(200)
      .json({
        status:RESPONSE_STATUS_USER.SUCCESS,
      }).end()
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
      console.log(error)
      res.status(500).send({message:"something went wrong"})
  }
};

//deleteProfile
const deleteProfile = async (req, res, next) => {
  // TODO: delete user profile using user_id

  try {
    const { user_id } = req;
    console.log(user_id);
    const user = await User.findById(user_id).select("-password");
    if (user) {
      console.log("exist");
      await User.findByIdAndDelete(user_id);
      return res
        .status(200)
        .json({ message: "user has been delete successfully" });
    } else {
      console.log("not exist");
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"something went wrong"})  }
};

//updateProfile
const updateProfile = async (req, res, next) => {
  try {
    // TODO: update user profile using user_id
    const { user_id } = req;
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"something went wrong"})
  }
};

module.exports = {
  getProfile,
  deleteProfile,
  updateProfile,
}