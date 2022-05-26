const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
  console.log("Its in middlewere!");
  res.send(
    "<form action='/admin/product' method='POST'><input type='text' name='title'/><button type='submit'>Add product</button></form>"
  );
});

router.post("/product", (req, res, next) => {
  console.log("[EXPRESS BODY]: ", req.body);
  res.redirect("/");
});

module.exports = router;
