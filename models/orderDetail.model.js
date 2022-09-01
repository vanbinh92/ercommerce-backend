const sequelize = require("./config.model.js");
const DataTypes = require("sequelize");

const OrderdetailModel = sequelize.define(
  "orderdetails",
  {
    quantityProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    VAT: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = OrderdetailModel;
