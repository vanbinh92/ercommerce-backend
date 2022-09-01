const { Op } = require("sequelize");
const fs = require("fs");
const cloudinary = require("../cloudinary");

const {
  ProductModel,
  CategoryModel,
  ManufactureModel,
  imageProduct,
} = require("../models");
const sequelize = require("sequelize");

const getAllProduct = async (req, res) => {
  try {
    const productList = await ProductModel.findAll({
      include: [
        { model: CategoryModel },
        { model: ManufactureModel },
        { model: imageProduct },
      ],
      raw: true,
      order: [["avgRating", "desc"]],
    });
    res.status(200).json(productList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findOne({
      where: {
        id: productId,
      },
      include: [
        { model: CategoryModel },
        { model: ManufactureModel },
        { model: imageProduct },
      ],
      raw: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Not found Product" });
    }

    res.status(200).json({ message: "Get product successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// search data by manufactureid
const getProductByManufactureId = async (req, res) => {
  try {
    const { manufactureId } = req.params;

    const products = await ProductModel.findAll({
      where: {
        manufactureId,
      },
      include: [
        { model: ManufactureModel },
        { model: CategoryModel },
        { model: imageProduct },
      ],
      raw: true,
    });

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// search data by category ID
const getProductByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await ProductModel.findAll({
      where: {
        categoryId,
      },
      include: [
        { model: ManufactureModel },
        { model: CategoryModel },
        { model: imageProduct },
      ],
      raw: true,
    });

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const pagination = async (req, res) => {
  try {
    let { page, limit } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let { count, rows } = await ProductModel.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.status(200).json({
      count,
      rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const paginationByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    let { page, limit, manufacture, sort, rate } = req.query;
    manufacture = parseInt(manufacture);
    rate = parseInt(rate);
    if (manufacture == 0) {
      if (sort == "asc") {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { rows, count } = await ProductModel.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          where: {
            [Op.and]: {
              categoryId: categoryId,
              avgRating: {
                [Op.gte]: parseInt(rate),
              },
            },
          },
          include: [
            { model: ManufactureModel },
            { model: CategoryModel },
            { model: imageProduct },
          ],
          raw: true,
          order: [["price", "asc"]],
        });
        res.status(200).json({
          count,
          rows,
        });
      } else if (sort == "desc") {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { rows, count } = await ProductModel.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          where: {
            [Op.and]: {
              categoryId: categoryId,
              avgRating: {
                [Op.gte]: parseInt(rate),
              },
            },
          },
          include: [
            { model: ManufactureModel },
            { model: CategoryModel },
            { model: imageProduct },
          ],
          raw: true,
          order: [["price", "desc"]],
        });
        res.status(200).json({
          count,
          rows,
        });
      } else {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { rows, count } = await ProductModel.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          where: {
            [Op.and]: {
              categoryId: categoryId,
              avgRating: {
                [Op.gte]: parseInt(rate),
              },
            },
          },
          include: [
            { model: ManufactureModel },
            { model: CategoryModel },
            { model: imageProduct },
          ],
          raw: true,
          order: [["avgRating", "desc"]],
        });
        res.status(200).json({
          count,
          rows,
        });
      }
    } else {
      if (sort == "asc") {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { rows, count } = await ProductModel.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          where: {
            [Op.and]: {
              categoryId: categoryId,
              manufactureId: manufacture,
              avgRating: {
                [Op.gte]: parseInt(rate),
              },
            },
          },
          include: [
            { model: ManufactureModel },
            { model: CategoryModel },
            { model: imageProduct },
          ],
          raw: true,
          order: [["price", "asc"]],
        });
        res.status(200).json({
          count,
          rows,
        });
      } else if (sort == "desc") {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { rows, count } = await ProductModel.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          where: {
            [Op.and]: {
              categoryId: categoryId,
              manufactureId: manufacture,
              avgRating: {
                [Op.gte]: parseInt(rate),
              },
            },
          },
          include: [
            { model: ManufactureModel },
            { model: CategoryModel },
            { model: imageProduct },
          ],
          raw: true,
          order: [["price", "desc"]],
        });
        res.status(200).json({
          count,
          rows,
        });
      } else {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { rows, count } = await ProductModel.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          where: {
            [Op.and]: {
              categoryId: categoryId,
              manufactureId: manufacture,
              avgRating: {
                [Op.gte]: parseInt(rate),
              },
            },
          },
          include: [
            { model: ManufactureModel },
            { model: CategoryModel },
            { model: imageProduct },
          ],
          raw: true,
          order: [["avgRating", "desc"]],
        });
        res.status(200).json({
          count,
          rows,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const paginationByManufacture = async (req, res) => {
  const { manufactureId } = req.params;
  try {
    let { page, limit } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let { count, rows } = await ProductModel.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: {
        manufactureId,
      },
      include: [
        { model: ManufactureModel },
        { model: CategoryModel },
        { model: imageProduct },
      ],
    });
    res.status(200).json({
      count,
      rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const initProduct = async (req, res) => {
  function base64_encode(file) {
    return "data:image/gif;base64," + fs.readFileSync(file, "base64");
  }
  try {
    const { name, price, description, nameManufacture, categoryId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(404).json({ message: "Pls provide an image" });
    }

    // find manufacturer
    const foundManufacturer = await ManufactureModel.findOne({
      where: {
        [Op.and]: {
          name: nameManufacture,
          categoryId: categoryId,
        },
      },
    });
    if (!foundManufacturer) {
      return res.status(404).json({ message: "Not Found Manufacturer" });
    }

    // find category
    const foundCategory = await CategoryModel.findOne({
      where: {
        id: categoryId,
      },
    });
    if (!foundCategory) {
      return res.status(404).json({ message: "Not Found Category" });
    }

    // find product by manufacture
    const foundProduct = await ProductModel.findOne({
      where: {
        [Op.and]: {
          manufactureId: foundManufacturer.id,
          name,
        },
      },
    });
    if (foundProduct) {
      return res.status(409).json({ message: "product has been existed" });
    }

    const base64str = base64_encode(file.path);
    const uploadCloud = await cloudinary.uploader.upload(base64str, {
      upload_preset: "products",
    });

    const image = {
      image_id: uploadCloud.public_id,
      image: uploadCloud.url,
    };

    // save data to DB
    const newImage = await imageProduct.create(image);

    const product = {
      name,
      price,
      description,
      categoryId: foundCategory.id,
      manufactureId: foundManufacturer.id,
      imageId: newImage.id,
    };

    // save data to DB
    const newProduct = await ProductModel.create(product);

    if (!newProduct) {
      return res.status(400).json({ message: "Create product unsuccessfully" });
    }
    res.status(201).json({ message: "Created New Product", newProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, nameCategory, nameManufacture } =
      req.body;
    const { productId } = req.params;

    const foundProduct = await ProductModel.findByPk(productId);

    if (!foundProduct) {
      return res.status(404).json({ message: "Not Found Product" });
    }
    const foundCategory = await CategoryModel.findOne({
      where: {
        name: nameCategory,
      },
    });
    if (!foundCategory) {
      return res.status(404).json({ message: "Not Found Category" });
    }
    const foundManufacture = await ManufactureModel.findOne({
      where: {
        name: nameManufacture,
      },
    });
    if (!foundManufacture) {
      return res.status(404).json({ message: "Not Found Manufacture" });
    }
    const update = {};
    if (name) update.name = name;
    if (price) update.price = price;
    if (description) update.description = description;
    if (nameCategory) update.categoryId = foundCategory.id;
    if (nameManufacture) update.manufactureId = foundManufacture.id;

    await ProductModel.update(update, {
      where: {
        id: productId,
      },
    });

    const foundProductUpdate = await ProductModel.findByPk(productId);

    res.status(201).json({
      message: "update product successfully",
      foundProductUpdate,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const foundProduct = await ProductModel.findByPk(productId);

    if (!foundProduct) {
      return res.status(404).json({ message: "Not Found Product" });
    }

    // delete data from DB
    await ProductModel.destroy({
      where: {
        id: productId,
      },
    });

    res.status(201).json({
      message: "Delete successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query, limit, page } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let { count, rows } = await ProductModel.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: {
        name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("products.name")),
          "LIKE",
          "%" + query.toLowerCase() + "%"
        ),
      },
      include: [
        { model: ManufactureModel },
        { model: CategoryModel },
        { model: imageProduct },
      ],
      raw: true,
    });
    res.status(200).json({
      message: "Search successfully",
      count,
      rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  getProductByCategoryId,
  getProductByManufactureId,
  pagination,
  initProduct,
  updateProduct,
  removeProduct,
  paginationByCategory,
  paginationByManufacture,
  searchProducts,
};
