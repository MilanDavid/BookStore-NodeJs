import Product from "../models/product.mjs";
import Order from "../models/order.mjs";

const ShopController = () => {
  const getProducts = (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/product-list", {
          prods: products,
          pageTitle: "All Products",
          path: "/products",
        });
      })
      .catch((err) => console.log("[FETCH ALL ERROR]: ", err));
  };

  const getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        res.render("shop/product-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products",
        });
      })
      .catch((err) => console.log("[FIND BY ID ERROR]: ", err));
  };

  const getIndex = (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "/",
        });
      })
      .catch((err) => console.log("[FETCH ALL ERROR]: ", err));
  };

  const getCart = (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const products = user.cart.items;
        res.render("shop/cart", {
          pageTitle: "Cart",
          path: "/cart",
          products: products,
        });
      })
      .catch((err) => console.log("[GET PRODUCTS ERROR]: ", err));
  };

  const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then((product) => {
        return req.user.addToCart(product);
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log("[ADD TO CART ERROR]: ", err));
  };

  const postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
      .deleteCartItem(prodId)
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log("[GET CART ERROR]: ", err));
  };

  const postOrder = (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const order = new Order({
          products: user.cart.items.map((item) => {
            return {
              quantity: item.quantity,
              item: { ...item.productId._doc },
            };
          }),
          user: {
            name: req.user.name,
            userId: req.user,
          },
        });
        return order.save();
      })
      .then(() => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect("/orders");
      })
      .catch((err) => console.log("[GET CART ERROR]: ", err));
  };

  const getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
      .then((orders) => {
        res.render("shop/orders", {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders,
        });
      })
      .catch((err) => console.log("[GET ORDERS ERROR]: ", err));
  };

  return {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    postCart,
    postCartDeleteItem,
    postOrder,
    getOrders,
  };
};

export default ShopController;
