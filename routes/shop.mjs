import express from "express";
import ShopController from "../controllers/shop.mjs";

import { isAuth } from "../middleware/is-auth.mjs";

const router = express.Router();

router.get("/products", ShopController.getProducts);

router.get("/products/:productId", ShopController.getProduct);

router.get("/cart", isAuth, ShopController.getCart);

router.post("/cart", isAuth, ShopController.postCart);

router.post("/cart-detele-item", isAuth, ShopController.postCartDeleteItem);

router.post("/create-order", isAuth, ShopController.postOrder);

router.get("/orders", isAuth, ShopController.getOrders);

router.get("/", ShopController.getIndex);

export default router;
