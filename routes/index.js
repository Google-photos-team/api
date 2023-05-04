// import routes
const AuthRouter = require('./auth');
const ImagesRouter = require('./images');
const FoldersRouter = require('./folders');
const ProfileRouter = require('./profile');

module.exports = (app) => {
    app.use("/auth", AuthRouter)
    app.use("/images", ImagesRouter)
    app.use("/folders", FoldersRouter)
    app.use("/profile", ProfileRouter)
}