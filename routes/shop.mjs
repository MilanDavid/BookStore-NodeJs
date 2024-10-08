import express from "express";
import ShopController from "../controllers/shop.mjs";

const router = express.Router();

router.get("/products", ShopController.getProducts);

router.get("/products/:productId", ShopController.getProduct);

router.get("/cart", ShopController.getCart);

router.post("/cart", ShopController.postCart);

router.post("/cart-detele-item", ShopController.postCartDeleteItem);

router.post("/create-order", ShopController.postOrder);

router.get("/orders", ShopController.getOrders);

router.get("/", ShopController.getIndex);

export default router;
