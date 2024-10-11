import User from "../models/user.mjs";
import bcrypt from "bcryptjs";

const AuthController = {
  getLogin: (req, res) => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: message,
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
              req.session.save((err) => {
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
          .then(() => {
            res.redirect("/login");
          })
          .catch((err) => console.log("[HASH PASSWORD ERROR]: ", err));
      })
      .catch((err) => console.log("[SAVE USER ERROR]: ", err));
  },
};

export default AuthController;
