const { Op } = require("sequelize");
const { CartModel, ProductModel, imageProduct } = require("../models");

const getCartById = async () => {
  try {
    const { id } = req.params;

    const cart = await CartModel.findOne({
      where: {
        id,
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Not Found Cart" });
    }

    res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const carts = await CartModel.findAll({
      where: {
        userId,
      },
      include: { model: ProductModel, include: { model: imageProduct } },
      raw: true,
    });
    
    const newCarts = carts.map((item) => {
      return {
        id: item["product.id"],
        name: item["product.name"],
        price: item["product.price"],
        description: item["product.description"],
        image: item["product.imageProduct.image"],
        quantityProduct: item.quantityProduct,
      };
    });
    res.status(200).json({ mesage: "Get add cart successfully!", newCarts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCartByProductId = async () => {
  try {
    const { productId } = req.query;

    const carts = await CartModel.findAll({
      where: {
        productId,
      },
    });

    res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const initCart = async (req, res) => {
  try {
    const { userId, productId, quantityProduct } = req.params;

    const foundCart = await CartModel.findOne({
      where: {
        [Op.and]: {
          userId,
          productId,
        },
      },
    });

    if (foundCart) {
      return res
        .status(404)
        .json({ message: "This product has been added to your cart" });
    }

    await CartModel.create({
      userId,
      productId,
      quantityProduct: quantityProduct,
    });

    res.status(201).json({ message: "Add your cart successfully" });
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};
const createCarts = async (req, res) => {
  const { userId } = req.params;
  const { products } = req.body;
  const newCarts = [];
  for (const item of products) {
    await CartModel.destroy({
      where: {
        [Op.and]: {
          userId,
          productId: item.id,
        },
      },
    });

    const obj = {
      userId,
      quantityProduct: item.quantityProduct,
      productId: item.id,
    };
    newCarts.push(obj);
  }
  await CartModel.bulkCreate(newCarts);
  res.status(201).json({ mesage: "Add your cart successfully" });
};
const updateCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const foundCart = await CartModel.findOne({
      where: {
        [Op.and]: {
          userId,
          productId,
        },
      },
    });
    if (!foundCart) {
      return res
        .status(404)
        .json({ message: "This product never been added to your cart" });
    }
    const newQuantity = foundCart.quantityProduct + 1;
    await CartModel.update(
      { quantityProduct: newQuantity },
      {
        where: {
          id: foundCart.id,
        },
      }
    );

    res
      .status(201)
      .json({ message: "Add your cart successfully", newQuantity });
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};
const removeCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const foundCart = await CartModel.findOne({
      where: {
        [Op.and]: {
          userId,
          productId,
        },
      },
    });

    if (!foundCart) {
      return res
        .status(404)
        .json({ message: "This product never been added to your cart" });
    }

    await CartModel.destroy({
      where: {
        id: foundCart.id,
      },
    });

    res.status(201).json({ message: "Remove your cart successfully" });
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};

module.exports = {
  getCartById,
  getCartByProductId,
  getCartByUserId,
  initCart,
  createCarts,
  updateCart,
  removeCart,
};
