// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
const mongoose = require('mongoose');
const RESPONSE_STATUS = require('../../constants/status');
const Image = require('../../db/Schemas/image');
const Folder = require('../../db/Schemas/folder');
const User = require('../../db/Schemas/user');

const { imageValidation } = require('../../utils/validation');

const createImage = async (req, res, next) => {
    // TODO: create a new image and save it with the user preferred upload quality using sharp
    try {
        const { user_id } = req;
        const { folder_id, name, tags, image } = req.body;
        await imageValidation.imageSchema.validate({
            folder_id, name, tags, image
        }, { abortEarly: false })
        if (!mongoose.Types.ObjectId.isValid(folder_id)) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "invalid folder id"
            })
        }

        const folder = await Folder.findOne({ user_id, _id: folder_id });
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                error: "user id not exist in the database"
            })
        }

        if (!folder) {
            return res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                error: "folder id not exist in the database"
            })
        }

        const imageInstance = await Image.create({
            folder_id,
            name,
            tags,
            image
        })

        folder.images = [...folder.images, imageInstance._id];
        user.images = [...user.images, imageInstance._id];

        await folder.save();
        await user.save();

        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: imageInstance
        })

    } catch (error) {
        if (error.name === "ValidationError") {
            const errs = {};
            error.inner.forEach(({ message, params }) => {
                errs[params.path] = message;
            });

            return res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                errors: errs,
            })
        } else {
            console.log({ error })
            return res.status(500).send({
                status: RESPONSE_STATUS.FAILED,
                error: "something went wrong"
            })
        }
    }
}

const deleteImages = (req, res, next) => {
    // TODO: delete list of images using req.body.images array of ids
}

const moveImages = (req, res, next) => {
    // TODO: move list of images using req.body.images array of ids from the target_folder to the destination_folder
}

const findImages = async(req, res, next) => {
    // TODO: find list of images using the search query and images tags
    try{
        const { user_id } = req;
        const { value } = req.params || "";
        const regex = new RegExp(value, 'i')
        const user = await User.findById(user_id).populate({ path: "images" });
        
        const matchingImages = user.images.filter(image => {
            const nameMatches = image.name.match(regex);
            const tagsMatch = image.tags.some(tag => tag.match(regex));
            return nameMatches || tagsMatch;
        });

        res.json({
            images: matchingImages
        })
    }catch(error){
        res.status(400).json({
            type: "unknow_error",
            data: "something went wrong"
        })
    }
}

module.exports = {
    createImage,
    deleteImages,
    moveImages,
    findImages
}