const app = require("express");
const {
  getAllReview,
  createReview,
  getReviewByProduct,
} = require("../controllers/review.controller");
const ReviewRouter = app.Router();

ReviewRouter.get("/", getAllReview);
ReviewRouter.get("/product/:productId", getReviewByProduct);
ReviewRouter.post("/user/:userId/product/:productId", createReview);

module.exports = ReviewRouter;
