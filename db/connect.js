const mongoose = require('mongoose')
const MONGO_URI =
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@google-photos.yuwz1gi.mongodb.net/google-photos?retryWrites=true&w=majority`

const PORT = process.env.PORT || 8080;

module.exports = (app) => {
    mongoose.connect(MONGO_URI)
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on localhost:${PORT} ✨`);
            });
        })
        .catch((err) => {
            console.log("Something went wrong with the database connection");
        });
}