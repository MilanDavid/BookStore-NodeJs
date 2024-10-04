import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

/**
 * Connect to MongoDB
 * @param {Function} callback - The callback function to execute after connection
 */
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.c3g0q.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

/**
 * Get the MongoDB database instance
 * @returns {import('mongodb').Db} The MongoDB database instance
 */
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

export { getDb, mongoConnect };
