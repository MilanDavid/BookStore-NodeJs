import User from "../models/user.mjs";

const AuthController = {
  getLogin: (req, res) => {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: req.session.isLoggedIn,
    });
  },

  postLogin: (req, res) => {
    User.findById("670298fa03572f284fb5675d")
      .then((user) => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          console.log("[LOGIN ERROR]: ", err);
          res.redirect("/");
        });
      })
      .catch((err) => console.log("[APP USER MIDDLEWARE]: ", err));
  },

  postLogout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  },
};

export default AuthController;
