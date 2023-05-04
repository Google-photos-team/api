// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

const createImage = (req, res, next) => {
    // TODO: create a new image and save it with the user preferred upload quality using sharp
}

const deleteImages = (req, res, next) => {
    // TODO: delete list of images using req.body.images array of ids
}

const moveImages = (req, res, next) => {
    // TODO: move list of images using req.body.images array of ids from the target_folder to the destination_folder
}

const findImages = (req, res, next) => {
    // TODO: find list of images using the search query and images tags
}

module.exports = {
    createImage,
    deleteImages,
    moveImages,
    findImages
}