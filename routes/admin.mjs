import express from "express";
import AdminController from "../controllers/admin.mjs";
import { isAuth } from "../middleware/is-auth.mjs";

const router = express.Router();

router.get("/add-product", isAuth, AdminController.getAddProduct);

router.post("/add-product", isAuth, AdminController.postAddProduct);

router.get("/products", isAuth, AdminController.getProducts);

router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);

router.post("/edit-product", isAuth, AdminController.postEditProduct);

router.post("/delete-product", isAuth, AdminController.postDeleteProduct);

export default router;
