const ErrorHandling = {
  get404: (req, res, next) => {
    res.status(404).render("404", {
      pageTitle: "Page not Found!",
      path: "/404",
      isAuthenticated: req.session.isLoggedIn,
    });
  },

  get500: (req, res, next) => {
    res.status(500).render("500", {
      pageTitle: "Server Error!",
      path: "/500",
      isAuthenticated: req.session.isLoggedIn,
    });
  },
};

export default ErrorHandling;
