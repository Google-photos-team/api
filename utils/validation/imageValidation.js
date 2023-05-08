const yup = require("yup");

const imageSchema = yup.object({
  folder_id: yup.string().required("Folder ID is required"),
  name: yup.string().required("Image Name is required"),
  image: yup.string().required("Image is required"),
  tags: yup.array().of(yup.string()).required("Image tags field is required"),
})

const moveImageSchema = yup.object({
  source_folder_id: yup.string().required("Source folder id is required"),
  destination_folder_id: yup.string().required("Destination folder id is required"),
  images: yup.array().of(yup.string()).required("Images ids is required").min(1 , "at least move one image"),
})

module.exports = {
  imageSchema,
  moveImageSchema
}