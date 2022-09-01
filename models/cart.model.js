const sequelize = require("./config.model.js");
const DataTypes = require("sequelize");

const CartModel = sequelize.define(
  "carts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantityProduct: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = CartModel;
