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

const deleteImages = async (req, res, next) => {
    // TODO: delete list of images using req.body.images array of ids

    try {
        const { user_id } = req;
        const { images, folder_id } = req.body;
        // validation on folder_id
        if (!folder_id) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "folder id is required"
            })
        }

        if (!images) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "images ids is required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(folder_id)) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "invalid folder id"
            })
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

        res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: deletedImages
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "invalid folder id in the delete ids list"
            })
        }

        console.log(error);
        res.status(500).send({
            status: RESPONSE_STATUS.FAILED,
            error: "something went wrong"
        })
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
        }, { abortEarly: false })

        if (!mongoose.Types.ObjectId.isValid(destination_folder_id)) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "Invalid destination folder id"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(source_folder_id)) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "Invalid source folder id"
            })
        }

        const sourceFolder = await Folder.findOne({ user_id, _id: source_folder_id }).exec();
        const destinationFolder = await Folder.findOne({ user_id, _id: destination_folder_id }).exec();
        if (!sourceFolder) {
            return res.status(404).json({
                status: RESPONSE_STATUS.FAILED,
                error: "Source folder not exist in the database"
            })
        }

        if (!destinationFolder) {
            return res.status(404).json({
                status: RESPONSE_STATUS.FAILED,
                error: "Destination folder not exist in the database"
            })
        }

        console.log({ sourceFolder: sourceFolder })
        sourceFolder.images = [...sourceFolder.images?.filter(id => !images.includes(id.toString()))];
        destinationFolder.images = [
            ...destinationFolder.images,
            ...images.map(id => new mongoose.Types.ObjectId(id))
        ];

        sourceFolder.save();
        destinationFolder.save();

        const MovedImages = await Image.updateMany(
            { _id: { $in: images } },
            { folder_id: new mongoose.Types.ObjectId(destination_folder_id) }
        );

        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: MovedImages
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
        }

        console.log(error);
        res.status(500).send({
            status: RESPONSE_STATUS.FAILED,
            error: "something went wrong"
        })
    }
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