const { Op } = require("sequelize");
const { ManufactureModel, CategoryModel } = require("../models");

const getManufacturer = async (req, res) => {
  try {
    const found = await ManufactureModel.findAll({
      include: [{ model: CategoryModel }],
      raw: true,
    });
    const arr = [];
    found.map((e) => {
      const obj = {
        id: e.id,
        name: e.name,
        nameCategory: e["category.name"],
      };
      arr.push(obj);
    });
    res.status(200).json(arr);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getManufacturerById = async (req, res) => {
  try {
    const { manufactureId: id } = req.params;
    const manufacturer = await ManufactureModel.findByPk(id);

    if (!manufacturer) {
      return res.status(404).json({ message: "Not Found Manufacturer" });
    }

    res
      .status(200)
      .json({ message: "Get Manufacture successfully", manufacturer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getManufacturerByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const foundManufacture = await ManufactureModel.findAll({
      where: {
        categoryId: categoryId,
      },
    });
    if (!foundManufacture) {
      return res.status(404).json("Not found manufacture");
    }
    res.status(200).json(foundManufacture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const initManufacturer = async (req, res) => {
  try {
    const { name, nameCategory } = req.body;

    const foundCategory = await CategoryModel.findOne({
      where: {
        name: nameCategory,
      },
    });
    if (!foundCategory) {
      return res.status(400).json({ message: "category has not existed" });
    }
    // save data
    const foundManufacture = await ManufactureModel.findOne({
      where: {
        [Op.and]: {
          name: name,
          categoryId: foundCategory.id,
        },
      },
    });
    if (foundManufacture) {
      return res
        .status(400)
        .json({ message: "name manufacture and category existed" });
    }
    await ManufactureModel.create({
      name: name,
      categoryId: foundCategory.id,
    });

    res.status(200).json({
      message: "Created Manufacture successfully",
      name,
      nameCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const removeManufacturer = async (req, res) => {
  try {
    const { manufactureId: id } = req.params;
    const foundManufacturer = await ManufactureModel.findOne({
      where: {
        id,
      },
    });
    if (!foundManufacturer) {
      return res.status(404).json({ message: "Not Found Data" });
    }

    // Delete data
    await ManufactureModel.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateManufacturer = async (req, res) => {
  try {
    const { manufactureId: id } = req.params;
    const { name } = req.body;
    const foundManufacturer = await ManufactureModel.findByPk(id);

    if (!foundManufacturer) {
      return res.status(404).json({ message: "Not Found Data" });
    }

    const update = {};

    if (name) {
      await ManufactureModel.findOne({
        where: {
          name,
        },
      });
      update.name = name;
    }

    await ManufactureModel.update(update, {
      where: {
        id,
      },
    });
    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getManufacturer,
  initManufacturer,
  removeManufacturer,
  updateManufacturer,
  getManufacturerById,
  getManufacturerByCategoryId,
};
