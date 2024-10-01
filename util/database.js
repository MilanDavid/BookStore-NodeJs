const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("node-tut", "root", "rootroot", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;