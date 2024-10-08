import express from "express";
import AuthController from "../controllers/auth.mjs";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

router.post("/logout", AuthController.postLogout);

export default router;
