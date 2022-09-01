const sequelize = require('./config.model.js')
const DataTypes = require('sequelize');

const PayModel = sequelize.define("payments",
    {
        method: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false
        }


    },

    {
        timestamps: true,
    }

);

module.exports = PayModel;
