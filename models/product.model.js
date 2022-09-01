const sequelize = require("./config.model.js");
const DataTypes = require("sequelize");

const ProductModel = sequelize.define(
  "products",
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: "name require number of characters must be between 3 to 100",
        },
      },
    },
    avgRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    totalRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = ProductModel;
