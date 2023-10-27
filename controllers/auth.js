const { User, validateEmail, validateUser} = require("../models/user")
const bcrypt = require("bcrypt")
const { createUser, createChapterAccount } = require("./user")
const {status} = require("../helpers/enum")
const { signAccessToken, signRefreshToken, verifyRefreshToken, signEmailToken } = require("./refreshToken")
const { parseBoolean } = require("../helpers/commonFunctions")
const { sendAlreadyRegisteredEmail, sendVerificationEmail, sendPasswordResetEmail } = require("../middlewares/sendEmail")
const ErrorChecker = require("../helpers/emailError")

// exports.createUser = async (req, res, next) => {
exports.signUpUser = async (req, res, next) => {
    try {
      const { error } = validateUser(req.body); // Validate the request body using Joi schema

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const account_type = req.body.account_type;
      const origin = req.headers.host;
      

      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;

      // // Password validation rules
      // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
      // const passwordErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";

      // Check if password and confirmPassword match
      if (!confirmPassword) {
        return res.status(400).json({ message: "Please confirm your password" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // // Check if password meets the validation rules
      // if (!passwordRegex.test(password)) {
      //   return res.status(400).json({ message: passwordErrorMessage });
      // }
      const hashed_password = await bcrypt.hash(password, 10)
      let email_token = await signEmailToken(req.body.email)
      
      let user;
      if (account_type === "institution" || account_type === "state" || account_type === "zone" || account_type === "nec")
        user = await createChapterAccount(req.body.email, hashed_password, req.body.firstName, email_token, account_type)
        else {
          await createUser(req.body.email,hashed_password, req.body.firstName, req.body.lastName, email_token, account_type)
        }
      if (user && user.message) {
          await sendAlreadyRegisteredEmail(req.body.email, req.body.firstName, origin);
          res.status(204).json({ message: user.message });
        } else {
          await sendVerificationEmail(req.body.firstName, req.body.email, email_token, origin);
          res.status(201).json({ message: "Registration Complete Proceed to email comfirmation" });
        } 
    }
    catch (err) {
      // Handle the error
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (ErrorChecker.isEmailError(err)) {
        return res.status(err.statusCode).json({ message: "Error  sending verification email, please try again later" });
      }
      next(err);
    }   
}


//login user normal way
exports.loginUser = async (req, res, next) => {
  try {
    // const { error } = validateEmail(req.body); // Validate the request body using Joi schema

    //   if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    //   }
    const loadedUser = await User.findOne({email: req.body.email})
    // console.log(loadedUser);

    if (!loadedUser) {
      const error = new Error("A user with this email cannot be found");
      error.statusCode = 404;
      throw error;
    }

    if (loadedUser.status === status.PENDING.value) {
      const error = new Error("Please check your email to verify your email and try again");
      error.statusCode = 401;
      throw error;  
    }

    let isEqual = await bcrypt.compare(req.body.password, loadedUser.password);
    // console.log(isEqual);
    if (!isEqual) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const admin = parseBoolean(loadedUser.isAdmin);

    const accessToken = await signAccessToken(loadedUser._id, admin, loadedUser.account_type);
    const refreshToken = await signRefreshToken(loadedUser._id);
    const numUpdated = await  User.findByIdAndUpdate(loadedUser._id, {status: status.ONLINE.value})

    const userAccountDetails = {
      "profileStatus": loadedUser.profile_status,
      "firstName": loadedUser.firstName,
      "lastName": loadedUser.lastName,
      "isSuperAdmin": loadedUser.isSuperAdmin,
      "isAdmin": loadedUser.isAdmin,
      "account_type": loadedUser.account_type
    }

    if (numUpdated) {
      res.status(201).json({ message: "Login Successful", accessToken, refreshToken, userAccountDetails });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    if (!refreshToken) {
      const error = new Error();
      error.statusCode = 400;
      throw error;
    }
    const userRef = await User.findOne({ refresh_token: refreshToken }).select('refresh_token');
    const refToken = userRef.refresh_token;
    if (refToken < 1) {
      const error = new Error();
      error.statusCode = 401;
      throw error;
    }
    console.log(refToken);
    // const token  = refToken[0];

    const user_id = await verifyRefreshToken(refToken);
    const user = await User.findById(user_id);
    console.log(user_id, user.firstName, user.email);
    const accessToken = await signAccessToken(user_id, parseBoolean(user.isAdmin));
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    // console.log(refreshToken)
    if (!refreshToken) {
      const error = new Error();
      error.statusCode = 400;
      throw error;
    }
    const userId = await verifyRefreshToken(refreshToken);
    console.log(userId);
    const numUpdated = await User.findByIdAndUpdate(userId, {refresh_token: "", status: status.ACTIVE.value})
    // const numUpdated = await User.findByIdAndUpdate(userId, {$unset: { refresh_token: 1, status: status.ACTIVE.value }})
    if (numUpdated) {
      res.status(201).json({ message: "Logout Successful" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  } 
};

exports.verifyUser = async (req, res, next) => {
  try {
    const email = req.payload;
    if (!email) {
      const error = new Error();
      error.statusCode = 400;
      throw error;
    }
    const loadedUser = await User.findOne({email: email});
    if (!loadedUser) {
      const error = new Error("A user with this email cannot be found");
      error.statusCode = 404;
      throw error;
    }
    const numUpdated = await User.findByIdAndUpdate(loadedUser._id, {status: status.ACTIVE.value})
    if (numUpdated) {
      res.status(201).json({ message: "Verified Successfully" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const email = req.payload;
    if (!email) {
      const error = new Error();
      error.statusCode = 400;
      throw error;
    }
    const loadedUser = await User.findOne({email: email})
    if (!loadedUser) {
      const error = new Error("A user with this email cannot be found");
      error.statusCode = 404;
      throw error;
    }

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // Password validation rules
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const passwordErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";

    // Check if password and confirmPassword match
    if (!confirmPassword) {
      return res.status(400).json({ message: "Please confirm your password" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if password meets the validation rules
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: passwordErrorMessage });
    }
    const hashed_password = await bcrypt.hash(password, 10)
    const numUpdated = await User.findByIdAndUpdate(loadedUser._id, {password: hashed_password, status: status.ACTIVE.value});
    if (numUpdated) {
      res.status(201).json({ message: "Password reset Successfully" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    
    const { error } = validateEmail(req.body); // Validate the request body using Joi schema

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const email = req.body.email;
    const loadedUser = await User.findOne({email: email})
    if (!loadedUser) {
      const error = new Error("A user with this email cannot be found");
      error.statusCode = 404;
      throw error;
    }
    if (loadedUser.status === status.PENDING.value) {
      const error = new Error("A user with this email cannot be found");
      error.statusCode = 404;
      throw error;
    } else if (loadedUser.status === status.INACTIVE.value) {
      const error = new Error("This user has been suspended");
      error.statusCode = 401;
      throw error;
    } else {
      let reset_token = await signEmailToken(req.body.email);
      const origin = req.headers.host;
      await sendPasswordResetEmail(loadedUser.lastName, email, origin, reset_token);
      res.status(201).json({ message: "An email was sent to the user" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};