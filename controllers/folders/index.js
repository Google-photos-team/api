// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
const { default: RESPONSE_STATUS } = require('../../constants/status');
const Folder = require('../../db/Schemas/folder');

const getFolders = (req, res, next) => {
    // TODO: get all user folders from the db
    try {
        const { user_id } = req.headers;
        const folders = Folder.find({ user_id: user_id });
        console.log(folders);
        res.status(200).json(folders)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "something went wrong" })
    }
}

const getFolderImages = (req, res, next) => {
    // TODO: get all images inside the folder using folderId
}

const deleteFolders = (req, res, next) => {
    // TODO: delete list of folders using req.body.folders array of ids
    try {
        const { user_id } = req.headers;
        const { folders } = req.body;
        Folder.deleteMany({ user_id, _id: { $in: folders } });
        res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: folders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: RESPONSE_STATUS.FAILED,
            error: "something went wrong"
        })
    }
}

const createFolder = (req, res, next) => {
    // TODO: create new folder
    try {
        const { user_id } = req.headers;
        const { name } = req.body;
        if (Folder.exists({ user_id, name })) {
            res.status(200).json({
                status: RESPONSE_STATUS.FAILED,
                error: "folder name already used"
            })
        } else {
            res.status(200).json({
                status: RESPONSE_STATUS.FAILED,
                data: folders
            })
        }
    } catch (error) {
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