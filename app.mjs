import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.mjs";
import authRoutes from "./routes/auth.mjs";
import shopRoutes from "./routes/shop.mjs";
import get404 from "./controllers/error.mjs";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import { fileURLToPath } from "url";
import User from "./models/user.mjs";
import connectMongodbSession from "connect-mongodb-session";
import csurf from "csurf";
import flash from "connect-flash";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the MONGODB_URI
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?${process.env.MONGODB_OPTIONS}`;
const app = express();
const MongoDbStore = connectMongodbSession(session);
const csrfProtection = csurf();

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log("[APP USER MIDDLEWARE]: ", err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
