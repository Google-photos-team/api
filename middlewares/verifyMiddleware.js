const verifyToken = require('../helpers/verifyToken');
const User = require('../db/Schemas/user');

const verifyMiddleware = async (req, res, next) => {
  if (!req.url.startsWith("/auth") || req.url.startsWith("/auth/reset-password") || req.url.startsWith("/auth/token")) {
      // TODO: Check on the auth token and get the user_id then add header in request include the user id
      try{
          const token = req.headers.authorization?.split(" ")[1];

          if(!token){
              const err = new Error("THERE_IS_NO_TOKEN_PASSED")
              err.name = "INVALID_HEADER"
              err.status = 400;
              throw err;
          }
          const verified = await verifyToken(token);
          const existUser = await User.exists({_id:verified})
          if(existUser){
              req.user_id = verified;
          }else{
              const err = new Error("INVALID_TOKEN")
              err.name = "INVALID";
              err.status = 400;
              throw err;
          }

      }catch(error){
          next(error)          
      }

  }
  next();
}

module.exports = verifyMiddleware