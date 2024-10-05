import express from "express";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.mjs";
import shopRoutes from "./routes/shop.mjs";
import path from "path";
import { mongoConnect } from "./util/database.mjs";
import { fileURLToPath } from "url";
import { User } from "./models/user.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("6700050eac6c6f3410c5a0eb")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log("[APP USER MIDDLEWARE]: ", err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

mongoConnect(() => {
  app.listen(3000);
});
