// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
const mongoose = require('mongoose');
const Image = require('../../db/Schemas/image');
const Folder = require('../../db/Schemas/folder');
const User = require('../../db/Schemas/user');
const createHttpError = require("http-errors");

const { imageValidation } = require('../../utils/validation');

const createImage = async (req, res, next) => {
    // TODO: create a new image and save it with the user preferred upload quality using sharp
    try {
        const { user_id } = req;
        const { folder_id, name, tags, image } = req.body;
        await imageValidation.imageSchema.validate({ folder_id, name, tags, image })
            .then(async () => {
                if (!mongoose.Types.ObjectId.isValid(folder_id)) {
                    return next(createHttpError(400, "invalid folder id"))
                }

                const folder = await Folder.findOne({ user_id, _id: folder_id });
                const user = await User.findById(user_id);

                if (!user) {
                    return next(createHttpError(404, "user id not exist in the database"))
                }

                if (!folder) {
                    return next(createHttpError(404, "folder id not exist in the database"))
                }

                const imageInstance = await Image.create({
                    folder_id,
                    name,
                    tags,
                    image,
                    user_id
                })

                folder.images = [...folder.images, imageInstance._id];
                user.images = [...user.images, imageInstance._id];

                await folder.save();
                await user.save();

                return res.json({
                    status: true,
                    data: imageInstance
                })
            })
            .catch((error) => {
                return next(createHttpError(400, error))
            })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const deleteImages = async (req, res, next) => {
    // TODO: delete list of images using req.body.images array of ids
    try {
        const { user_id } = req;
        const { images, folder_id } = req.body;
        // validation on folder_id
        if (!folder_id) {
            return next(createHttpError(400, "folder id is required"))
        }

        if (!images) {
            return next(createHttpError(400, "images ids is required"))
        }

        if (!mongoose.Types.ObjectId.isValid(folder_id)) {
            return next(createHttpError(400, "invalid folder id"))
        }

        // delete images from user list
        const user = await User.findById(user_id);
        user.images = [...user.images.filter(id => !images.includes(id.toString()))];
        await user.save();

        // delete images from Image store
        const deletedImages = await Image.deleteMany({ folder_id, _id: { $in: images } });

        // delete images ids from the folder document images list
        const folder = await Folder.findById(folder_id);
        folder.images = [...folder.images.filter(id => !images.includes(id.toString()))];
        folder.save();

        res.json({
            status: true,
        })
    } catch (error) {
        if (error.name === "CastError") {
            return next(createHttpError(400, "invalid folder id in the delete ids list"))
        }

        return next(createHttpError(500, error.message))
    }
}

/*  
    ! MOVE STEPS
    * 1. validation
    * 2. find source folder
    * 3. find destination folder
    * 4. move imagesToMove ids from source to destination list
    * 5. update all images in imagesToMove array change folder_id reference from source to destination id
*/

const moveImages = async (req, res, next) => {
    // TODO: move list of images using req.body.images array of ids from the target_folder to the destination_folder
    try {
        const { user_id } = req;
        const { images, destination_folder_id, source_folder_id } = req.body;

        await imageValidation.moveImageSchema.validate({
            images,
            destination_folder_id,
            source_folder_id
        }).then(async () => {
            if (!mongoose.Types.ObjectId.isValid(destination_folder_id)) {
                return next(createHttpError(400, "Invalid destination folder id"))
            }

            if (!mongoose.Types.ObjectId.isValid(source_folder_id)) {
                return next(createHttpError(400, "Invalid source folder id"))
            }

            const sourceFolder = await Folder.findOne({ user_id, _id: source_folder_id }).exec();
            if (!sourceFolder) {
                return next(createHttpError(404, "Source folder not exist in the database"))
            }

            const destinationFolder = await Folder.findOne({ user_id, _id: destination_folder_id }).exec();
            if (!destinationFolder) {
                return next(createHttpError(404, "Destination folder not exist in the database"))
            }
            sourceFolder.images = [...sourceFolder.images?.filter(id => !images.includes(id.toString()))];
            destinationFolder.images = [
                ...destinationFolder.images,
                ...images.map(id => new mongoose.Types.ObjectId(id))
            ];

            sourceFolder.save();
            destinationFolder.save();

            await Image.updateMany(
                { _id: { $in: images } },
                { folder_id: new mongoose.Types.ObjectId(destination_folder_id) }
            );

            return res.json({
                status: true,
            })
        }).catch((error) => {
            return next(createHttpError(400, error))
        })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const findImages = async (req, res, next) => {
    // TODO: find list of images using the search query and images tags
    try {
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
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

module.exports = {
    createImage,
    deleteImages,
    moveImages,
    findImages
}