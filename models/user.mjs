import * as mongodb from "mongodb";
import { getDb } from "../util/database.mjs";

export class User {
  constructor(username, email, cart, userId) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this.userId = userId ? new mongodb.ObjectId(`${userId}`) : null;
  }

  save() {
    // Save the user to the database
    const db = getDb();
    if (this.userId) {
      return db
        .collection("users")
        .updateOne({ _id: this.userId }, { $set: this });
    } else {
      return db.collection("users").insertOne(this);
    }
  }

  addToCart(product) {
    // Add a product to the user's cart
    const db = getDb();
    const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
      return cartProduct.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(`${product._id}`),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    return db
      .collection("users")
      .updateOne({ _id: this.userId }, { $set: { cart: updatedCart } })
      .then((result) => {
        console.log("[ADD TO CART RESULT]: ", result);
      })
      .catch((err) => {
        console.log("[ADD TO CART ERROR]: ", err);
      });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.log("[GET CART ERROR]: ", err);
      });
  }

  deleteCartItem(productId) {
    const updatedCartItems = this.cart.items
      .map((item) => {
        if (item.productId.toString() === productId.toString()) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    console.log("[UPDATED CART ITEMS]: ", updatedCartItems);
    return getDb()
      .collection("users")
      .updateOne(
        { _id: this.userId },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then((result) => {
        console.log("[DELETE CART ITEM RESULT]: ", result);
      })
      .catch((err) => {
        console.log("[DELETE CART ITEM ERROR]: ", err);
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this.userId,
            username: this.username,
            email: this.email,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this.userId }, { $set: { cart: { items: [] } } });
      })
      .catch((err) => {
        console.log("[GET CART ERROR]: ", err);
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": this.userId })
      .toArray()
      .then((orders) => {
        return orders;
      })
      .catch((err) => {
        console.log("[GET ORDERS ERROR]: ", err);
      });
  }

  static findById(userId) {
    // Fetch a user from the database
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(`${userId}`) })
      .then((user) => {
        console.log("[USER]: ", user);
        return user;
      })
      .catch((err) => {
        console.log("[FIND BY ID ERROR]: ", err);
      });
  }
}
