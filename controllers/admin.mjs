import { Product } from "../models/product.mjs";
import { getDb } from "../util/database.mjs";

const AdminController = () => {
  const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
    });
  };

  const getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        if (!product) {
          return res.redirect("/");
        }
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product,
        });
      })
      .catch((err) => console.log("[FIND BY ID ERROR]: ", err));
  };

  const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description);
    product.save().then((result) => {
      console.log("Created Product");
      res.redirect("/shop");
    });
  };

  const postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const product = new Product(
      updatedTitle,
      updatedPrice,
      updatedImageUrl,
      updatedDescription,
      prodId
    );

    return product
      .save()
      .then(() => {
        res.redirect("/admin/products");
      })
      .catch((err) => console.log("[FIND BY ID ERROR]: ", err));
  };

  const getProducts = (req, res, next) => {
    Product.fetchAll()
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
        });
      })
      .catch((err) => console.log("[FIND ALL ERROR]: ", err));
  };

  const postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
      .then(() => {
        res.redirect("/admin/products");
      })
      .catch((err) => console.log("[DELETE BY ID ERROR]: ", err));
  };

  return {
    getAddProduct,
    getEditProduct,
    postAddProduct,
    postEditProduct,
    getProducts,
    postDeleteProduct,
  };
};

export default AdminController;