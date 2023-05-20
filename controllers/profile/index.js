const createHttpError = require("http-errors");
const mongoose = require("mongoose");

const Folder = require("../../db/Schemas/folder");
const Image = require("../../db/Schemas/image");
const User = require("../../db/Schemas/user");
const { profileValidation } = require("../../utils/validation");

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
//getProfile
const getProfile = async (req, res, next) => {
  const { user_id } = req;
  try {
    const user = await User.findById(user_id, "username avatar");

    res.json({
      status: true,
      data: user
    });
  } catch (error) {
    return next(createHttpError(500, error.message))
  }
};

//deleteProfile
const deleteProfile = async (req, res, next) => {
  const { user_id } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session, new: true };
    await User.findByIdAndDelete(user_id, opts);
    await Folder.deleteMany({ user_id }, opts);
    await Image.deleteMany({ user_id }, opts);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: true,
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(createHttpError(500, error.message))
  }
};

//updateProfile
const updateProfile = async (req, res, next) => {
  const { user_id } = req;
  const { username, avatar } = req.body;

  try {
    const user = await User.findById(user_id, "username avatar");
    profileValidation.updateSchema.validate({ username })
      .then(async () => {
        // first condition to check if the username not updated so we don't mack DB query
        if (username && username !== user.username) {
          const isExist = await User.exists({ username });
          if (isExist) {
            return next(createHttpError(409, "user already exist"))
          }
        }

        const newValues = {};
        if (username && username !== user.username) {
          newValues.username = username
        };

        if (typeof avatar === "string" && avatar !== user.avatar) {
          newValues.avatar = avatar
        };

        const updatedUser = await User.findByIdAndUpdate(user_id, newValues, { new: true });

        res.json({
          status: true,
          data: {
            username: updatedUser.username,
            avatar: updatedUser.avatar,
          }
        });
      }).catch((error) => {
        return next(createHttpError(400, error))
      });


  } catch (error) {
    return next(createHttpError(500, error.message))
  }
};

module.exports = {
  getProfile,
  deleteProfile,
  updateProfile,
}