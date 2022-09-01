const {
  PayModel,
  OrderModel,
  OrderdetailModel,
  CartModel,
} = require("../models");

require("dotenv").config();
const sequelize = require("../models/config.model");

const sendMail = require("../services/email.service");

const getPayById = async (req, res) => {
  const { id } = req.params;

  try {
    const foundPay = await PayModel.findByPk(id);
    if (!foundPay) {
      return res.status(404).json({ mesasge: "Not Found Payment" });
    }
    res.status(200).json(foundPay);
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

const getPayByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const foundPay = await PayModel.findOne({
      where: {
        orderId,
      },
    });
    if (!foundPay) {
      return res.status(404).json({ message: "Not Found Payment" });
    }
    res.status(200).json(foundPay);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const initPay = async (req, res) => {
  const t = await sequelize.transaction();

  const {
    method,
    totalPrice,
    userId,
    products,
    email,
    fullName,
    phone,
    address,
  } = req.body;
  
  try {
    const newOrder = await OrderModel.create(
      {
        userId,
        fullName,
        phone,
        address,
      },
      { transaction: t }
    );
      
    const orderDetailBulkData = [];
    const removeCartIds = [];
    products.forEach((item) => {
      orderDetailBulkData.push({
        orderId: newOrder.id,
        productId: item.id,
        quantityProduct: item.quantityProduct,
        VAT: 10,
      });
      removeCartIds.push(item.id);
    });
    await OrderdetailModel.bulkCreate(orderDetailBulkData, {
      transaction: t,
    });
    const newPayment = await PayModel.create(
      {
        method: method,
        total: totalPrice,
        orderId: newOrder.id,
      },
      { transaction: t }
    );

    await CartModel.destroy(
      { where: { productId: removeCartIds } },
      { transaction: t }
    );
    await t.commit();

    await sendMail(
      `${email}`,
      `Successful Payment`,
      `Thanks for ordering at our BK store
        Payment Details:
        #####################################
        PaymentID: ${newPayment.id},
        Payment method: ${method},
        Recipient: ${fullName},
        Phone: ${phone},
        Address: ${address},
        Paid :$${totalPrice}
        #####################################
        Good luck and have fun!
    `
    );
    res.status(200).json({ message: "Payment successfully !" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json({ message: error.mesasge });
  }
};

module.exports = {
  getPayById,
  getPayByOrderId,
  initPay,
};
