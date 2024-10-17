import express from "express";
import AdminController from "../controllers/admin.mjs";
import { isAuth } from "../middleware/is-auth.mjs";
import validator from "express-validator";

const router = express.Router();

router.get("/add-product", isAuth, AdminController.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  [
    validator.body("title").isString().isLength({ min: 3 }).trim(),
    validator.body("imageUrl").isURL(),
    validator.body("price").isFloat(),
    validator.body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  AdminController.postAddProduct
);

router.get("/products", isAuth, AdminController.getProducts);

router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);

router.post("/edit-product", isAuth, AdminController.postEditProduct);

router.post("/delete-product", isAuth, AdminController.postDeleteProduct);

export default router;
