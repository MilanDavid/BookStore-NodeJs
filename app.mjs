import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.mjs";
import authRoutes from "./routes/auth.mjs";
import shopRoutes from "./routes/shop.mjs";
import ErrorHandling from "./controllers/error.mjs";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import { fileURLToPath } from "url";
import User from "./models/user.mjs";
import connectMongodbSession from "connect-mongodb-session";
import csurf from "csurf";
import flash from "connect-flash";
import nodemailer from "nodemailer";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the MONGODB_URI
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?${process.env.MONGODB_OPTIONS}`;
const app = express();
const MongoDbStore = connectMongodbSession(session);
const csrfProtection = csurf();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "fredrick.frami@ethereal.email",
    pass: "hZQN6cBFsn28SYD345",
  },
});

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
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", ErrorHandling.get500);

app.use(ErrorHandling.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
