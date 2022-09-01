const { Sequelize } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_SQL,
//   process.env.USERNAME_SQL,
//   process.env.PASSWORD_SQL,
//   {
//     host: process.env.HOST_SQL,
//     dialect: process.env.DIALECT_SQL,
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );
const sequelize = new Sequelize(
  "postgres://qrinlwzdbwfksw:6123135d556c07fe7ee680703389ca8de761d5475fae7d72ff60e8663cd761bb@ec2-3-225-110-188.compute-1.amazonaws.com:5432/ddomhsd90q8o0c",
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;

