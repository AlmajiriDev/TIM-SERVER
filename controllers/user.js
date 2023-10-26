const { User } = require("../models/user")
const {status} = require("../helpers/enum")



//Save New Individual User Account into db
exports.createUser = async (email, hashed_password, firstName, lastName, email_token, account_type, isAdmin = false, refresh_token="") => {
    let regStatus = status.PENDING.value
  

    let row = await User.findOne({email});
    if (row && row.status === regStatus) {
      await User.findOneAndUpdate({_id: row._id}, {email_token})
      return row;
    } else if (row && row.status !== regStatus) {
      return { row, message: "Already Registered" };
    }
    const userExists = await User.findOne({email})
    if (userExists) {
      return { message: "User already exists" };
    } 
    else {
      let emailToken = email_token !== "" ? { email_token } : "";
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashed_password,
        status: regStatus,
        isAdmin: isAdmin,
        isSuperAdmin: false,
        ...emailToken,
        account_type: account_type,
        refresh_token: refresh_token,
        profile: null,
        institution_profile: null,
        state_profile: null,
        zone_profile: null,
        profile_status: null,
      }
      let result = await User.create(data)
      // console.log({"result": result})
      return result
    }
    }

//Save New Chapter User Account into db
exports.createChapterAccount = async (email, hashed_password, firstName, email_token, account_type, refresh_token="") => {
  let regStatus = status.PENDING.value

  let row = await User.findOne({email});
  if (row && row.status === regStatus) {
    await User.findOneAndUpdate({_id: row._id}, {email_token})
    return row;
  } else if (row && row.status !== regStatus) {
    return { row, message: "Already Registered" };
  }
  const userExists = await User.findOne({email})
  if (userExists) {
    return { message: "User already exists" };
  } 
  else {
    let emailToken = email_token !== "" ? { email_token } : "";
    const data = {
      firstName: firstName,
      lastName: "TIMSAN",
      email: email,
      password: hashed_password,
      status: regStatus,
      isAdmin: false,
      isSuperAdmin: false,
      ...emailToken,
      account_type: account_type,
      refresh_token: refresh_token,
      profile: null,
      institution_profile: null,
      state_profile: null,
      zone_profile: null,
      nec_profile: null,
      profile_status: null,

    }
    let result = await User.create(data)
    // console.log({"result": result})
    return result
  }
  }
  

  