// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

const getFolders = (req, res, next) => {
    // TODO: get all user folders from the db
}

const getFolderImages = (req, res, next) => {
    // TODO: get all images inside the folder using folderId
}

const deleteFolders = (req, res, next) => {
    // TODO: delete list of folders using req.body.folders array of ids
}

const createFolder = (req, res, next) => {
    // TODO: create new folder
}

module.exports = {
    getFolders,
    getFolderImages,
    deleteFolders,
    createFolder
}