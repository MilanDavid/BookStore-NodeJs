const get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page not Found!",
      path: null,
      isAuthenticated: req.session.isLoggedIn,
    });
};

export default get404;
