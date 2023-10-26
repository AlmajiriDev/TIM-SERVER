const nodemailer = require("nodemailer");
const sib = require("nodemailer-sendinblue-transport");


const transport = nodemailer.createTransport(new sib({
    apiKey: process.env.SIB_API_KEY
}));

const sendEmail = async (message) => {
  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    } else {
      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return true;
      }
    }
  )}

  //send verificaton email using nodemailer
  exports.sendVerificationEmail = async (name, email, emailToken, origin) => {
    console.log("hit waiting for reply ....");
    const message = {
      from: '"TIMSAN NG" <admin@timsan.com.ng>',
      to: email,
      subject: "Verify account - TIMSAN NG",
      text: "Account verification link",
      html: `<h2>Verify Email</h2>
                  <h4>Hello ${name}</h4>
                  <p>Thanks for registering! <br> Click the link below to verify your email </p>
                  <p> http://${origin}/verify-email/${emailToken}</p>
                 `,
    };
    try {
      await sendEmail(message);
    } catch (error) {
      setTimeout(() => {
        error && sendEmail(message);
      }, 30000);
    }
  };
  
  exports.sendAlreadyRegisteredEmail = async (email, name, origin) => {
    const message = {
        from: '"TIMSAN NG" <admin@timsan.com.ng>',
        to: email,
        subject: "Verify account - TIMSAN NG",
        text: "Account verification link",
        html: `<h4>Email Already Registered</h4>
                  <h4>Hello ${name}</h4>
                  <p>Your email <strong>${email}</strong> is already registered.</p>
                  <p>If you don't know your password please visit the <a href="http://${origin}/user/forgot-password">forgot password</a> page.</p>`,
    };
    try {
      await sendEmail(message);
    } catch (error) {
      setTimeout(() => {
        error && sendEmail(message);
      }, 30000);
    }
  };
  
  exports.sendPasswordResetEmail = async (name, email, origin, resetToken) => {
    const resetUrl = `${origin}/resetting-password/${resetToken}`;
    const message = {
        from: '"TIMSAN NG" <admin@timsan.ng>',
        to: email,
        subject: "Verify account - TIMSAN NG",
        text: "Account verification link",
        html: `<h4>Reset Password Email</h4>
                  <h4>Hello ${name}</h4>
                  <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };
    try {
      await sendEmail(message);
    } catch (error) {
      setTimeout(() => {
        error && sendEmail(message);
      }, 30000);
    }
  };
  