const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-detele-item", shopController.postCartDeleteItem);

router.post("/create-order", shopController.postOrder);

router.get("/orders", shopController.getOrders);

router.get("/", shopController.getIndex);

module.exports = router;
