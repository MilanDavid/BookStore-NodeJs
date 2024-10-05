import * as mongodb from "mongodb";
import { getDb } from "../util/database.mjs";

export class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(`${id}`) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // update
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
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

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(`${prodId}`) })
      .then((result) => {
        console.log("[DELETE PRODUCT RESULT]: ", result);
      })
      .catch((err) => {
        console.log("[DELETE PRODUCT ERROR]: ", err);
      });
  }
}
