// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
const mongoose = require('mongoose');

const RESPONSE_STATUS = require('../../constants/status');
const Folder = require('../../db/Schemas/folder');
const User = require('../../db/Schemas/user');
const Image = require('../../db/Schemas/image');

const getFolders = async (req, res, next) => {
    // TODO: get all user folders from the db
    try {
        const { user_id } = req;
        const user = await User.findById(user_id).populate({ path: "folders" });
        res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            folders: user.folders || []
        }).end()
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "something went wrong" })
    }
}

const getFolderImages = async (req, res, next) => {
    // TODO: get all images inside the folder using folderId
    try {
        const folder_id = req.params.id;
        const { user_id } = req;

        if (!mongoose.Types.ObjectId.isValid(folder_id)) {
            return res.status(400).send({
                status: RESPONSE_STATUS.FAILED,
                error: "invalid folder id"
            })
        }

        const folder = await Folder.findOne({ user_id, _id: folder_id }).populate("images");

        if (!folder) {
            return res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                error: "folder not exist in the database"
            })
        }
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: folder?.images || []
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: RESPONSE_STATUS.FAILED,
            error: "something went wrong"
        })
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

        res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: deletedFolders
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

const createFolder = async (req, res, next) => {
    // TODO: create new folder
    try {
        const { user_id } = req;
        const { name } = req.body;
        if (!name) {
            res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                error: "folder name is required"
            })
            res.end();

            if (!new RegExp(/^[a-zA-Z0-9_\-]+$/g).test(name)) {
                res.status(400).json({
                    status: RESPONSE_STATUS.FAILED,
                    error: "folder name can include only characters, underscores (_), and hyphens (-)"
                });
                res.end();
            }
        }

        const exist = await Folder.exists({ user_id, name });
        if (exist) {
            res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                error: "folder name already used"
            })
            res.end();
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

            res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                data: folder
            }).end();
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send({
            status: RESPONSE_STATUS.FAILED,
            error: "something went wrong"
        })
    }
}

module.exports = {
    getFolders,
    getFolderImages,
    deleteFolders,
    createFolder
}