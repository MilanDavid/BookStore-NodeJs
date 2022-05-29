const express = require("express");
const path = require("path");

const rootDir = require("../helpers/path");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
  console.log("Its in middlewere!");
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/product", (req, res, next) => {
  console.log("[EXPRESS BODY]: ", req.body);
  res.redirect("/");
});

module.exports = router;
