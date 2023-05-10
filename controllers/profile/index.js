const { RESPONSE_STATUS_USER, RESPONSE_STATUS } = require("../../constants/status");
const image = require("../../db/Schemas/image");
const User = require("../../db/Schemas/user");
const bcrypt = require("bcryptjs");

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

// @desc      get user 
// @route     GET /profile
// @access    public

//getProfile
const getProfile = async (req, res, next) => {
  // TODO: get user profile using user_id
  try {
    const { user_id } = req;
    const user = await User.findById(user_id);
    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      username: user.username,
      avatar: user.avatar,
      images:user.images
    }).end()
} catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" })
}
};


// @desc      delete user 
// @route     DELETE /profile/delete
// @access    public

//deleteProfile
const deleteProfile = async (req, res, next) => {
  // TODO: delete user profile using user_id
  try {
    await User.findOneAndRemove({ _id: req.user_id});
    res.json({
      status: RESPONSE_STATUS.SUCCESS, 
      msg: 'User profile deleted', 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

};

// @desc      Update user data 
// @route     post /api/v1/users/:id
// @access    public

//updateProfile
const updateProfile = async (req, res, next) => {
    // TODO: update user profile using user_id
  try {
    const { user_id } = req;
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
          status: RESPONSE_STATUS.SUCCESS,
          username: req.body.username,
          password: req.body.password,
          avatar: req.body.avatar,
          images:req.body,image
        },
      },
      { new: true }
    )

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: RESPONSE_STATUS.FAILED,
      message:"something went wrong"
    })
  }  
};

module.exports = {
  getProfile,
  deleteProfile,
  updateProfile,
}