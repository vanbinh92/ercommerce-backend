const sequelize = require("./config.model.js");
const DataTypes = require("sequelize");

const imageProduct = sequelize.define(
  "imageProduct",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull:true
    },
  },
  {
    timestamps: true,
  }
);
module.exports = imageProduct;
