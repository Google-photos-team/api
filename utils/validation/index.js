const yup = require("yup");

const signupSchema = yup.object({
  username: yup.string().min(3).max(30).required("This field is required")
    .matches("^(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9_]+$", "Name can't contain spaces or special characters (only '_' is allowed)"),
  password: yup
    .string()
    .min(6)
    .max(100)
    .matches(/[a-z]/, 'password should contain at least one small letter')
    .matches(/[A-Z]/, 'password should contain at least one capital letter')
    .matches(/\d/, 'password should contain at least one number')
    .matches((/[^A-Za-z0-9]/), 'password should contain at least one special characters')
    .required(),
})

const imageSchema = yup.object({
  folder_id: yup.string().required("Folder ID is required"),
  name: yup.string().required("Image Name is required"),
  image: yup.string().required("Image is required"),
  tags: yup.array().of(yup.string()).required("Image tags field is required"),
})

module.exports = {
  signupSchema,
  imageSchema
}