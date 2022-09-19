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
  process.env.DATABASE_URL,
  // {
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false,
  //     },
  //   },
  // }
);

module.exports = sequelize;

