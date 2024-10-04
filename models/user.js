import * as mongodb from "mongodb";
import { getDb } from "../util/database.mjs";

export class User {
  constructor(username, email, userId) {
    this.username = username;
    this.email = email;
    this.userId = userId ? new mongodb.ObjectId(`${userId}`) : null;
  }

  save() {
    // Save the user to the database
    const db = getDb();
    if(this.userId) {
      return db.collection("users").updateOne({ _id: this.userId }, { $set: this });
    } else {
      return db.collection("users").insertOne(this);
    }
  }

  static findById(userId) {
    // Fetch a user from the database
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(`${userId}`) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log("[FIND BY ID ERROR]: ", err);
      });
  }
}
