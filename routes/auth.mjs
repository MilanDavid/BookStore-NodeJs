import express from "express";
import AuthController from "../controllers/auth.mjs";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

router.post("/signup", AuthController.postSignup);

router.post("/logout", AuthController.postLogout);

router.get("/signup", AuthController.getSignup);

router.get("/reset-password", AuthController.getResetPassword);

router.post("/reset-password", AuthController.postResetPassword);

router.get("/new-password/:token", AuthController.getNewPassword);

router.post("/new-password", AuthController.postNewPassword);

export default router;
