require("dotenv").config();
const mongodb = require("mongodb");

let _db;

const mongoConnect = (callback) => {
  mongodb.MongoClient.connect(
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

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
