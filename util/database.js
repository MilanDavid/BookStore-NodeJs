const mongodb = require("mongodb");

const mongoConnect = (callback) => {
  mongodb.MongoClient.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.c3g0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
    .then((client) => {
      callback(client);
      console.log("Connected!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;