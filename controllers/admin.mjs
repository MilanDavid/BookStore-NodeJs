import Product from "../models/product.mjs";
import { validationResult } from "express-validator";

const AdminController = {
  getAddProduct: (req, res, next) => {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "",
      validationErrors: [],
      product: {
        title: "",
        imageUrl: "",
        price: "",
        description: "",
      },
    });
  },

  getEditProduct: (req, res, next) => {
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
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect("/");
        }
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product,
          validationErrors: [],
        });
      })
      .catch((err) => console.log("[FIND BY ID ERROR]: ", err));
  },

  postAddProduct: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: req.body.title,
          imageUrl: req.body.imageUrl,
          price: req.body.price,
          description: req.body.description,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: req.user,
    });
    product
      .save()
      .then(() => {
        console.log("Created Product");
        res.redirect("/");
      })
      .catch((err) => console.log("[SAVE PRODUCT ERROR]: ", err));
  },

  postEditProduct: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        product: {
          _id: req.body.productId,
          title: req.body.title,
          imageUrl: req.body.imageUrl,
          price: req.body.price,
          description: req.body.description,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    return Product.findById(prodId)
      .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect("/");
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        return product
          .save()
          .then(() => {
            res.redirect("/admin/products");
          })
          .catch((err) => console.log("[SAVE PRODUCT ERROR]: ", err));
      })
      .catch((err) => console.log("[FIND BY ID ERROR]: ", err));
  },

  getProducts: (req, res, next) => {
    Product.find({
      userId: req.user._id,
    })
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
        });
      })
      .catch((err) => console.log("[FETCH ALL ERROR]: ", err));
  },

  postDeleteProduct: (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({ _id: prodId, userId: req.user._id })
      .then(() => {
        res.redirect("/admin/products");
      })
      .catch((err) => console.log("[DELETE BY ID ERROR]: ", err));
  },
};

export default AdminController;
