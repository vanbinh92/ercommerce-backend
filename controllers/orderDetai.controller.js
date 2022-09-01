const {
  OrderdetailModel,
  ProductModel,
  ManufactureModel,
  CategoryModel,
  imageProduct,
} = require("../models");

const getOrdersDetailByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const foundOrderDetails = await OrderdetailModel.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: ProductModel,
          include: [
            { model: CategoryModel },
            { model: ManufactureModel },
            { model: imageProduct },
          ],
        },
      ],
      raw: true,
    });
    res.status(200).json(foundOrderDetails);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrderDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundOrderDetail = await OrderdetailModel.findOne({
      where: { id: id },
    });
    if (!foundOrderDetail) {
      return res.status(404).json({ message: "Not Found Detail Order" });
    }
    res.status(200).json(foundOrderDetail);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrdersDetailByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const foundOrdersDetail = await OrderdetailModel.findAll({
      productId,
    });

    res.status(200).json(foundOrdersDetail);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const initOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { quantityProduct, VAT, productId } = req.body;

    const orderDetail = {
      quantityProduct,
      VAT,
      productId,
      orderId,
    };
    const newOrderDetail = await OrderdetailModel.create(orderDetail);
    if (!newOrderDetail) {
      return res
        .status(400)
        .json({ message: "Create Order Detail Unsuccessfully" });
    }

    res.status(201).json(newOrderDetail);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrderDetailById,
  getOrdersDetailByOrderId,
  getOrdersDetailByProductId,
  initOrderDetail,
};
