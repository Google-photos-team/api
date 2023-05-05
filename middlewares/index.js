const cors = require('cors');
const bodyParser = require('body-parser');
const verifyToken = require('../helpers/verifyToken');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(async (req, res, next) => {
        if (!req.url.startsWith("/auth") || req.url.startsWith("/auth/reset-password")) {
            // TODO: Check on the auth token and get the user_id then add header in request include the user id
            try{
                const token = req.headers.authorization?.split(" ")[1];

                if(!token){
                    const err = new Error("THERE_IS_NO_TOKEN_PASSED")
                    err.name = "UNAUTHORIZED" 
                    throw err;
                }
                const verified = await verifyToken(token);
                req.user_id = verified;

            }catch(error){
                if(error.name === "UNAUTHORIZED"){
                    res.status(400).json({
                        type: error.name,
                        data: error.message
                    })
                }else if(error.name === "INVALID"){
                    res.status(400).json({
                        type: error.name,
                        data: error.message
                    })
                }else{
                    res.status(404).json({
                        type: "unknow_error",
                        data: "something went wrong"
                    })
                }
                
            }

        }
        next();
    })
}