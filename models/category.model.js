const sequelize = require("./config.model.js");
const DataTypes = require("sequelize");

const CategoryModel = sequelize.define(
  "categories",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = CategoryModel;
