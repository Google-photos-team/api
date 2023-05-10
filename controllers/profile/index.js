const Folder = require("../../db/Schemas/folder");
const Image = require("../../db/Schemas/image");
const User = require("../../db/Schemas/user");
const { profileValidation } = require("../../utils/validation");
const mongoose = require("mongoose");

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

//getProfile
const getProfile = async (req, res, next) => {
  const { user_id } = req;
  try{
    const user = await User.findById(user_id ,"username avatar");
    res.json({
      user
    });
  }catch(error){
    res.status(400).send({message:"something went wrong"});
  }
};

//deleteProfile
const deleteProfile = async (req, res, next) => {
  const { user_id } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    const opts = { session, new: true };
    await User.findByIdAndDelete(user_id, opts);
    await Folder.deleteMany({ user_id }, opts);
    await Image.deleteMany({ user_id }, opts);

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      status: "user deleted successfully",
    })
  } catch(error){
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({message:"something went wrong"});
  }
};

//updateProfile
const updateProfile = async (req, res, next) => {
  const { user_id } = req;
  const { username, avatar } = req.body;

  try{
    const user = await User.findById(user_id, "username avatar");

    if(username && username !== user.username){
      const used = await User.exists({ username });
      if (used) {
        const err = new Error("USER_ALREADY_EXIST")
        err.name = "exist_user"
        throw err;
      }

      await profileValidation.updateSchema.validate({ username }, { abortEarly: false });
    }

    const values = {};
    if(username && username !== user.username) values.username = username;
    if(typeof avatar === "string" && avatar !== user.avatar) values.avatar = avatar;
    
    const updatedUser = await User.findByIdAndUpdate(user_id, values, { new: true });

    res.json({
      username: updatedUser.username,
      avatar: updatedUser.avatar,
    });
  }catch(error){
    if (error.name === "ValidationError") {
      const errs = {};
      error.inner.forEach(({ message, params }) => {
          errs[params.path] = message;
      });

      res.status(400).json({
          type: error.name,
          data: errs,
      })
    } else if (error.name === "exist_user") {
        res.status(400).json({
            type: error.name,
            data: error.message
        })
    } else {
      res.status(400).send({message:"something went wrong"});
    }
  }
};

module.exports = {
  getProfile,
  deleteProfile,
  updateProfile,
}