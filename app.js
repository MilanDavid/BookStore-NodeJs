const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const expressHbs = require("express-handlebars");

const app = express();

// HBS ENGINE
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not Found!", path: null });
});

app.listen(4000);
