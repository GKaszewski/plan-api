const { Sequelize, Model } = require("sequelize");

const env = process.env.NODE_ENV || "dev";

const config = require("./config")[env];

module.exports = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: "postgres",
  }
);
