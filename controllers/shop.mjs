import { Product } from "../models/product.mjs";

const ShopController = () => {
  const getProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.fetchAll()
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
    req.user.getCart().then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            pageTitle: "Cart",
            path: "/cart",
            products: products,
          });
        })
        .catch((err) => console.log("[GET PRODUCTS ERROR]: ", err));
    });
  };

  const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log("[GET CART ERROR]: ", err));
  };

  const postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
      .getCart()
      .then((cart) => {
        return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
        const product = products[0];
        if (product.cartItem.quantity > 1) {
          return product.cartItem.update({
            quantity: product.cartItem.quantity - 1,
          });
        }
        return product.cartItem.destroy();
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log("[GET CART ERROR]: ", err));
  };

  const postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then((products) => {
        return req.user
          .createOrder()
          .then((order) => {
            return order.addProducts(
              products.map((product) => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            );
          })
          .catch((err) => console.log("[CREATE ORDER ERROR]: ", err));
      })
      .then(() => {
        return fetchedCart.setProducts(null);
      })
      .then((result) => {
        res.redirect("/orders");
      })
      .catch((err) => console.log("[GET CART ERROR]: ", err));
  };

  const getOrders = (req, res, next) => {
    req.user
      .getOrders({ include: ["products"] })
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