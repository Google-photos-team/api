const yup = require("yup");

const imageSchema = yup.object({
  folder_id: yup.string().required("Folder ID is required"),
  name: yup.string().required("Image Name is required"),
  image: yup.string().required("Image is required"),
  tags: yup.array().of(yup.string()).required("Image tags field is required"),
})

module.exports = {
  imageSchema
}