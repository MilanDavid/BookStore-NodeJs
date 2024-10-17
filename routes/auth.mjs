import express from "express";
import AuthController from "../controllers/auth.mjs";
import validator from "express-validator";
import User from "../models/user.mjs";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post(
  "/login",
  [
    validator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email."),
    validator.body("password", "Password cannot be empty.").notEmpty().trim(),
  ],
  AuthController.postLogin
);

router.post(
  "/signup",
  [
    validator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === "admin@test.com") {
        //   throw new Error("This email is forbidden.");
        // }

        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User already exists.");
          }
        });
      })
      .normalizeEmail(),
    validator
      .body(
        "password",
        "Please enter a password with only numbers and text and at least 5 characters."
      )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .withMessage("Password use only alphanumeric caracters.")
      .trim(),
    validator
      .body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),
  ],
  AuthController.postSignup
);

router.post("/logout", AuthController.postLogout);

router.get("/signup", AuthController.getSignup);

router.get("/reset-password", AuthController.getResetPassword);

router.post("/reset-password", AuthController.postResetPassword);

router.get("/new-password/:token", AuthController.getNewPassword);

router.post("/new-password", AuthController.postNewPassword);

export default router;
