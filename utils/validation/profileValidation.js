const yup = require("yup");

const updateSchema = yup.object({
  username: yup.string().min(3).max(30).required("This field is required")
    .matches(/^(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9_]+$/, "Name can't contain spaces or special characters or numbers (only '_' is allowed)"),
})


module.exports = {
  updateSchema
}