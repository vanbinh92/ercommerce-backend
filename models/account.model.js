const sequelize = require('./config.model.js')
const DataTypes = require('sequelize');

const AccountModel = sequelize.define("accounts",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hashPwd: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
        },
    },

    {
        timestamps: true,
    }

);

module.exports = AccountModel;
