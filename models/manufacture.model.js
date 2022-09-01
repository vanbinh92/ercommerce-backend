const sequelize = require("./config.model.js");
const DataTypes = require("sequelize");

const ManufactureModel = sequelize.define(
  "manufactures",
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

module.exports = ManufactureModel;
