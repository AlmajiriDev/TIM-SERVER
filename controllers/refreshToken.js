const {User} = require("../models/user")
const JWT = require("jsonwebtoken");

// exports.isLoggedIn = async (req, res, next) => {
//   const {_id } = req.payload
//    User.findById(_id).select('status').exec((err, user) => {
//     if (err) throw err;
//     const accountStatus = user.statusCode
//     if(accountStatus !== 3){
//       return false
//   }})
// }

const createToken = async (userId, token, reject) => {
    try {
        await User.findByIdAndUpdate(userId, {$set: {refresh_token: token}})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            reject(err);
        }
    }
}


  const deleteToken = async (userId, reject) => {
    try {
        // console.log("token", token);
        let res = await User.findByIdAndUpdate(userId, {refresh_token:""})
      return;
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        reject(err);
      }
    }
  };

  const logout = async (token, reject) => {
    try {
      const userId = await User.findOne({refresh_token: token}).select()
      console.log("userId", userId)
      await deleteToken(userId, reject);
    } catch (err) {
      err.statusCode = 500;
      reject(err);
    }
  };



  module.exports = {
    signAccessToken: (userId, isAdmin) => {
      // console.log(isAdmin);
      return new Promise((resolve, reject) => {
        const payload = { userInfo: {_id: userId, admin: isAdmin, account_type} };
        const secret = process.env.JWT_SECRET;
        const options = {
          expiresIn: process.env.JWT_EXPIRE,
          issuer: "timsan.com.ng",
          audience: `${userId}`,
        };
        JWT.sign(payload, secret, options, (err, token) => {
          if (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            reject(err);
          }
          resolve(token);
        });
      });
    },


    verifyAccessToken: (req, res, next) => {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      // console.log(authHeader);
      if (!authHeader?.startsWith("Bearer ")) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        return next(error);
      }
  
      const bearerToken = authHeader.split(" ");
      const token = bearerToken[1];
      // console.log(token)
  
      JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          const error = new Error(message);
          error.statusCode = 401;
          return next(error);
        }
        // console.log(payload);
  
        req.isAdmin = payload.userInfo.admin;
        req.payload = payload.userInfo;
        
        next();
      });
    },

    signRefreshToken: (userId) => {
      return new Promise((resolve, reject) => {
        const payload = { userInfo: {_id: userId } };

        const secret = process.env.JWT_SECRET;
        const options = {
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
          issuer: "timsan.com.ng",
          audience: `${userId}`,
        };

        JWT.sign(payload, secret, options, (err, token) => {
          if (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            reject(err);
          }
          createToken(userId, token, reject);
          resolve(token);
        });
      });
    },

    verifyRefreshToken: (refreshToken) => {
      return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
          if (err) {
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            if (err.name === "TokenExpiredError") {
              await logout(refreshToken, reject);
            } //JWT expired error
            const error = new Error(message);
            error.statusCode = 401;
            reject(error);
          } else {
            const user_id = payload.userInfo._id; 
            resolve(user_id);
          }
          console.log(payload);
        });
      });
    },
  
    // for email token 
    signEmailToken: (email) => {
      // console.log(isAdmin);
      return new Promise((resolve, reject) => {
        const payload = { email };
        const secret = process.env.JWT_SECRET;
        const options = {
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
          issuer: "timsan.com.ng",
        };
        JWT.sign(payload, secret, options, (err, token) => {
          if (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            reject(err);
          }
          resolve(token);
        });
      });
    },
    verifyEmailToken: (req, res, next) => {
    const token = req.params.emailToken;
    console.log(token);
    if (!token) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }
    
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        const error = new Error(message);
        error.statusCode = 401;
        return next(error);
      }
      // console.log(payload);
      req.payload = payload.email;
      next();
    });
  },

  isLoggedIn: (req, res, next) => {
    const {_id } = req.payload
     User.findById(_id).select('status').exec((err, user) => {
      accountStatus = user.status
      if(accountStatus === 3){ 
        return next()
      }
      else{
        const error = new Error("You need to login");
        error.statusCode = 401;
        return next(error);
      }
    })
},

  isAdmin: (req, res, next) => {
    const {_id } = req.payload
    User.findById(_id).select('isAdmin').exec((err, user) => {
      adminStatus = user.isAdmin
      if(adminStatus === true){ 
        return next()
      }
      else{
        const error = new Error("Only Admin");
        error.statusCode = 401;
        return next(error);
      }
    })
},

isSuperAdmin: (req, res, next) => {
  const {_id } = req.payload
  User.findById(_id).select('isSuperAdmin').exec((err, user) => {
    adminStatus = user.isSuperAdmin
    if(adminStatus === true){ 
      return next()
    }
    else{
      const error = new Error("Only Super Admin");
      error.statusCode = 401;
      return next(error);
    }
  })
}

};
  
