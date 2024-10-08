import Product from "../models/product.mjs";
import Order from "../models/order.mjs";

const ShopController = {
  getProducts: (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/product-list", {
          prods: products,
          pageTitle: "All Products",
          path: "/products",
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log("[FETCH ALL ERROR]: ", err));
  },

  getProduct: (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        res.render("shop/product-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products",
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log("[FIND BY ID ERROR]: ", err));
  },

  getIndex: (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "/",
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log("[FETCH ALL ERROR]: ", err));
  },

  getCart: (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const products = user.cart.items;
        res.render("shop/cart", {
          pageTitle: "Cart",
          path: "/cart",
          products: products,
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log("[GET PRODUCTS ERROR]: ", err));
  },

  postCart: (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then((product) => {
        return req.user.addToCart(product);
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log("[ADD TO CART ERROR]: ", err));
  },

  postCartDeleteItem: (req, res, next) => {
    const prodId = req.body.productId;
    req.user
      .deleteCartItem(prodId)
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log("[GET CART ERROR]: ", err));
  },

  postOrder: (req, res, next) => {
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
  },

  getOrders: (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
      .then((orders) => {
        res.render("shop/orders", {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders,
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log("[GET ORDERS ERROR]: ", err));
  },
};

export default ShopController;
