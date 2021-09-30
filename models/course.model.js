const { Sequelize, Model, DataTypes } = require("sequelize");
const db = require("../database");

class Course extends Model {}
Course.init(
  {
    day: DataTypes.STRING,
    hour: DataTypes.STRING,
    name: DataTypes.STRING,
    group: DataTypes.STRING,
    professor: DataTypes.STRING,
    room: DataTypes.STRING,
    type: DataTypes.STRING,
    notes: DataTypes.STRING,
    dateFrom: DataTypes.DATE,
    dateTo: DataTypes.DATE,
  },
  { sequelize: db, modelName: "Course" }
);

module.exports = Course;
