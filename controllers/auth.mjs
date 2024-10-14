import User from "../models/user.mjs";
import bcrypt from "bcryptjs";
import { emailtransporter } from "../util/emailtransporter.mjs";
import crypto from "crypto";

const AuthController = {
  getLogin: (req, res) => {
    let errorMessage = req.flash("error");
    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0];
    } else {
      errorMessage = null;
    }
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errorMessage,
    });
  },

  postLogin: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Invalid email or password.");
          return res.redirect("/login");
        }

        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.user = user;
              req.session.isLoggedIn = true;
              return req.session.save((err) => {
                console.log("[LOGIN ERROR]: ", err);
                res.redirect("/");
              });
            }
            req.flash("error", "Invalid email or password.");
            res.redirect("/login");
          })
          .catch((err) => {
            console.log("[APP USER MIDDLEWARE]: ", err);
            res.redirect("/");
          });
      })
      .catch((err) => console.log("[COMPARE PASSWORD ERROR]: ", err));
  },

  postLogout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  },

  getSignup: (req, res) => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: message,
    });
  },

  postSignup: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
      .then((userDoc) => {
        if (userDoc) {
          req.flash("error", "User already exists.");
          return res.redirect("/signup");
        }

        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: email,
              password: hashedPassword,
              cart: { items: [] },
            });
            return user.save();
          })
          .then((result) => {
            res.redirect("/login");
            return emailtransporter
              .sendMail({
                to: email,
                from: "fredrick.frami@ethereal.email",
                subject: "Signup succeeded!",
                html: "<h1>You successfully signed up!</h1>",
              })
              .catch((err) => console.log("[SEND MAIL ERROR]: ", err));
          })
          .catch((err) => console.log("[HASH PASSWORD ERROR]: ", err));
      })
      .catch((err) => console.log("[SAVE USER ERROR]: ", err));
  },

  getResetPassword: (req, res, next) => {
    let errorMessage = req.flash("error");
    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0];
    } else {
      errorMessage = null;
    }

    res.render("auth/reset-password", {
      path: "/reset-password",
      pageTitle: "Reset Password",
      errorMessage: errorMessage,
    });
  },

  postResetPassword: (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log("[RANDOM BYTES ERROR]: ", err);
        return res.redirect("/reset-password");
      }
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email })
        .then((user) => {
          if (!user) {
            req.flash("error", "No account with that email found.");
            return res.redirect("/reset-password");
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then((result) => {
          res.redirect("/");
          return emailtransporter
            .sendMail({
              to: req.body.email,
              from: "osvaldo.mills61@ethereal.email",
              subject: "Password reset",
              html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password.</p>
              `,
            })
            .catch((err) => console.log("[SEND MAIL ERROR]: ", err));
        })
        .catch((err) => console.log("[SAVE USER ERROR]: ", err));
    });
  },

  getNewPassword: (req, res, next) => {
    const token = req.params.token;

    User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    }).then((user) => {
      let errorMessage = req.flash("error");
      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }

      if (!user) {
        req.flash("error", "Invalid token.");
        return res.redirect("/reset-password");
      }

      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage: errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    });
  },

  postNewPassword: (req, res, next) => {
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let reset = null;

    if (newPassword === "" || newPasswordConfirm !== newPassword) {
      req.flash("error", "Password cannot be empty.");
      return res.redirect(`/new-password/${passwordToken}`);
    }

    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
      .then((user) => {
        reset = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then((hashedPassword) => {
        reset.password = hashedPassword;
        reset.resetToken = undefined;
        reset.resetTokenExpiration = undefined;
        return reset.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => console.log("[UPDATE PASSWORD ERROR]: ", err));
  },
};

export default AuthController;
