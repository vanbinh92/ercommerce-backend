const { CategoryModel } = require("../models");

const getCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getCategoryByCategoryId = async (req, res) => {
  try {
    const { categoryId: id } = req.params;

    const category = await CategoryModel.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Not found Categories" });
    }

    res
      .status(200)
      .json({
        message: "Get Category successfully",
        category,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const initCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const foundCategory = await CategoryModel.findOne({
      where: {
        name
      },
    });
    if (foundCategory) {
      return res.status(409).json({ message: "category has been existed" });
    }

    // save data
    const newCategory = await CategoryModel.create({ name});
    if (!newCategory) {
      return res
        .status(400)
        .json({ message: "Create Category Unsuccessfully" });
    }

    res
      .status(201)
      .json({ message: "Created Category successfully", newCategory });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { name } = req.body;

    const foundCategory = await CategoryModel.findOne({where:{id:categoryId}});

    if (!foundCategory) {
      return res.status(404).json({ message: "Not Found Category" });
    }

    await CategoryModel.update({name:name}, {
      where: {
        id:categoryId
      },
    });

    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeCategory = async (req, res) => {
  try {
    const { categoryId: id } = req.params;

    const foundCategory = await CategoryModel.findOne({where:{id:id}});

    if (!foundCategory) {
      return res.status(404).json({ message: "Not Found Data" });
    }

    await CategoryModel.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategory,
  initCategory,
  removeCategory,
  updateCategory,
  getCategoryByCategoryId,
};
