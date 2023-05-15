// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
const mongoose = require('mongoose');
const createHttpError = require("http-errors");

const Folder = require('../../db/Schemas/folder');
const User = require('../../db/Schemas/user');
const Image = require('../../db/Schemas/image');

const getFolders = async (req, res, next) => {
    // TODO: get all user folders from the db
    try {
        const { user_id } = req;
        const user = await User.findById(user_id).populate({ path: "folders" });
        return res.json({
            status: true,
            data: user.folders || []
        })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const getFolderImages = async (req, res, next) => {
    // TODO: get all images inside the folder using folderId
    try {
        const folder_id = req.params.id;
        const { user_id } = req;

        if (!mongoose.Types.ObjectId.isValid(folder_id)) {
            return next(createHttpError(400, "invalid folder id"))
        }

        const folder = await Folder.findOne({ user_id, _id: folder_id }).populate("images");

        if (!folder) {
            return next(createHttpError(404, "folder not exist in the database"))
        }

        return res.json({
            status: true,
            data: folder?.images || []
        })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const deleteFolders = async (req, res, next) => {
    // TODO: delete list of folders using req.body.folders array of ids
    try {
        const { user_id } = req;
        const { folders } = req.body;
        const folders_from_DB = await Folder.find({ user_id, _id: { $in: folders } });
        const user = await User.findById(user_id);

        for (const folder of folders_from_DB) {
            // DELETE Images that exist in this folder
            await Image.deleteMany({
                folder_id: folder._id,
                _id: { $in: folder.images.map(el => el.toString()) }
            });
            // DELETE Images ids from User collection
            user.images = [...user.images.filter(id => !folder.images.includes(id.toString()))];
        }

        // DELETE folders ids from User collection
        user.folders = [...user.folders.filter(id => !folders.includes(id.toString()))];
        user.save();

        // DELETE folders documents for Folder collection
        const deletedFolders = await Folder.deleteMany({ user_id, _id: { $in: folders } });

        res.json({
            status: true,
            data: deletedFolders
        })
    } catch (error) {
        if (error.name === "CastError") {
            return next(createHttpError(400, "invalid folder id in the delete ids list"))
        }
        return next(createHttpError(500, error.message))
    }
}

const createFolder = async (req, res, next) => {
    // TODO: create new folder
    try {
        const { user_id } = req;
        const { name } = req.body;
        if (!name) {
            return next(createHttpError(400, "folder name is required"))
        }

        const exist = await Folder.exists({ user_id, name });
        if (exist) {
            return next(createHttpError(409, "folder name already used"))
        } else {
            const folder = await Folder.create({
                name,
                images: [],
                user_id
            })

            const user = await User.findById(user_id);
            user.folders = [...user.folders, folder._id];
            console.log({ user })
            await user.save();

            res.json({
                status: true,
                data: folder
            });
        }
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

module.exports = {
    getFolders,
    getFolderImages,
    deleteFolders,
    createFolder
}