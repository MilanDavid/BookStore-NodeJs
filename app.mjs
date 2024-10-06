import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.mjs";
import shopRoutes from "./routes/shop.mjs";
import get404 from "./controllers/error.mjs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import User from "./models/user.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("670298fa03572f284fb5675d")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log("[APP USER MIDDLEWARE]: ", err));
});


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(get404);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.c3g0q.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Milan",
          email: "miland.sm@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
