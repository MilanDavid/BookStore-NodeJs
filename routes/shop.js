const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/product-details", shopController.getProductDetails);

router.get("/cart", shopController.getCart);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

router.get("/", shopController.getIndex);

module.exports = router;
