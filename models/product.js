const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log("[RESULT OF SAVE PRODUCT]: ", result);
      })
      .catch((err) => {
        console.log("[SAVE PRODUCT ERROR]: ", err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log("[FETCH ALL ERROR]: ", err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(`${prodId}`) })
      .next()
      .then((product) => {
        console.log("[PRODUCT]: ", product);
        return product;
      })
      .catch((err) => {
        console.log("[FIND BY ID ERROR]: ", err);
      });
  }
}

module.exports = Product;
