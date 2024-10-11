import express from "express";
import AuthController from "../controllers/auth.mjs";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

router.post("/signup", AuthController.postSignup);

router.post("/logout", AuthController.postLogout);

router.get("/signup", AuthController.getSignup);

export default router;
