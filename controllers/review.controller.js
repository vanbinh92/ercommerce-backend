const ReviewModel = require("../models/review.model");
const { Op, Sequelize } = require("sequelize");
const {
  UserModel,
  AccountModel,
  OrderModel,
  OrderdetailModel,
  ProductModel,
  avatarUser,
} = require("../models");

const getAllReview = async (req, res) => {
  try {
    const reviews = await ReviewModel.findAll();
    res.status(200).json({ message: "Get all review successfully", reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getReviewByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const found = await ReviewModel.findAll({
      where: { productId },
      include: [
        {
          model: UserModel,
          include: [{ model: AccountModel }, { model: avatarUser }],
        },
      ],
      raw: true,
    });
    
    let num5star = 0;
    let num4star = 0;
    let num3star = 0;
    let num2star = 0;
    let num1star = 0;
    found.forEach((item) => {
      if (item.rating === 1) {
        num1star += 1;
      } else if (item.rating === 2) {
        num2star += 1;
      } else if (item.rating === 2) {
        num2star += 1;
      } else if (item.rating === 3) {
        num3star += 1;
      } else if (item.rating === 4) {
        num4star += 1;
      } else {
        num5star += 1;
      }
    });
    let avgRating;
    let totalRating = num1star + num2star + num3star + num4star + num5star;
    if (totalRating === 0) {
      avgRating = 0;
      var star = {
        totalRating: totalRating,
        avgRating: avgRating,
        percent5star: 0,
        percent4star: 0,
        percent3star: 0,
        percent2star: 0,
        percent1star: 0,
      };
    } else {
      avgRating = (
        (num1star + num2star * 2 + num3star * 3 + num4star * 4 + num5star * 5) /
        totalRating
      ).toFixed(1);
      var star = {
        totalRating: totalRating,
        avgRating: avgRating,
        percent5star: Math.round((num5star / totalRating) * 100),
        percent4star: Math.round((num4star / totalRating) * 100),
        percent3star: Math.round((num3star / totalRating) * 100),
        percent2star: Math.round((num2star / totalRating) * 100),
        percent1star: Math.round((num1star / totalRating) * 100),
      };
    }
    res
      .status(200)
      .json({ message: "Get review by product successfully", found, star });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const createReview = async (req, res) => {
  const { userId, productId } = req.params;
  const { rating, comment } = req.body;

  try {
    const foundOrder = await OrderModel.findAll({ where: { userId } });
    let arrOrder;
    if (foundOrder) {
      arrOrder = foundOrder.map((item) => {
        return item.id;
      });
    }
    const foundProduct = await OrderdetailModel.findAll({
      where: {
        [Op.and]: {
          orderId: arrOrder,
          productId: productId,
        },
      },
    });
    if (foundProduct.length > 0) {
      const found = await ReviewModel.findOne({
        where: {
          [Op.and]: {
            userId: userId,
            productId: productId,
          },
        },
      });
      if (!found) {
        const newReview = await ReviewModel.create({
          userId: userId,
          productId: productId,
          rating: rating,
          comment: comment,
        });
        const reviews = await ReviewModel.findAll({
          where: { productId: productId },
        });
        let num5star = 0;
        let num4star = 0;
        let num3star = 0;
        let num2star = 0;
        let num1star = 0;
        reviews.forEach((item) => {
          if (item.rating === 1) {
            num1star += 1;
          } else if (item.rating === 2) {
            num2star += 1;
          } else if (item.rating === 2) {
            num2star += 1;
          } else if (item.rating === 3) {
            num3star += 1;
          } else if (item.rating === 4) {
            num4star += 1;
          } else {
            num5star += 1;
          }
        });
        let avgRating;
        let totalRating = num1star + num2star + num3star + num4star + num5star;
        if (totalRating === 0) {
          avgRating = 0;
          await ProductModel.update(
            {
              avgRating: avgRating,
              totalRating: totalRating,
            },
            { where: { id: productId } }
          );
        } else {
          avgRating = (
            (num1star +
              num2star * 2 +
              num3star * 3 +
              num4star * 4 +
              num5star * 5) /
            totalRating
          ).toFixed(1);
          await ProductModel.update(
            {
              avgRating: avgRating,
              totalRating: totalRating,
            },
            { where: { id: productId } }
          );
        }
        res
          .status(200)
          .json({ message: "Create review successfully!", newReview });
      } else {
        await ReviewModel.update(
          {
            rating: rating,
            comment: comment,
          },
          {
            where: { id: found.id },
          }
        );
        res.status(201).json({ message: "Review update successfully!" });
      }
    } else {
      res
        .status(403)
        .json({ message: "please buy product before taking this action" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReview,
  getReviewByProduct,
  createReview,
};
