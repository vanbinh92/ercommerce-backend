const CartModel = require("./cart.model");
const CategoryModel = require("./category.model");
const UserModel = require("./user.model");
const ManufactureModel = require("./manufacture.model");
const OrderModel = require("./order.model");
const OrderdetailModel = require("./orderDetail.model");
const PayModel = require("./payment.model");
const ProductModel = require("./product.model");
const AccountModel = require("./account.model");
const ReviewModel = require("./review.model");
const avatarUser = require("./avatarUser.model");
const imageProduct = require("./imageProduct.model");

// UserModel vs AccountModel: one-to-one
AccountModel.hasOne(UserModel, {
  foreignKey: {
    name: "accountId",
  },
});

UserModel.belongsTo(AccountModel, {
  foreignKey: {
    name: "accountId",
  },
});

// UserModel vs AvatarUser: one-to-one
avatarUser.hasOne(UserModel, {
  foreignKey: {
    name: "avatarId",
  },
});

UserModel.belongsTo(avatarUser, {
  foreignKey: {
    name: "avatarId",
  },
});

// UserModel vs OrderModel : one to many
UserModel.hasMany(OrderModel, {
  foreignKey: {
    name: "userId",
  },
});

OrderModel.belongsTo(UserModel, {
  foreignKey: {
    name: "userId",
  },
});

// Account vs Cart: one to many
UserModel.hasMany(CartModel, {
  foreignKey: {
    name: "userId",
  },
});

CartModel.belongsTo(UserModel, {
  foreignKey: {
    name: "userId",
  },
});

// OrderModel vs PayModel: one to one
OrderModel.hasOne(PayModel, {
  foreignKey: {
    name: "orderId",
  },
});

PayModel.belongsTo(PayModel, {
  foreignKey: {
    name: "orderId",
  },
});

//OrderModel vs OrderDetail: one to many

OrderModel.hasMany(OrderdetailModel, {
  foreignKey: {
    name: "orderId",
  },
});

OrderdetailModel.belongsTo(OrderModel, {
  foreignKey: {
    name: "orderId",
  },
});

//ProductModel vs OrderDetail: one to one

ProductModel.hasOne(OrderdetailModel, {
  foreignKey: {
    name: "productId",
  },
});

OrderdetailModel.belongsTo(ProductModel, {
  foreignKey: {
    name: "productId",
  },
});

// ProductModel vs CartModel: one to many

ProductModel.hasMany(CartModel, {
  foreignKey: {
    name: "productId",
  },
});
CartModel.belongsTo(ProductModel, {
  foreignKey: {
    name: "productId",
  },
});

//Category vs ProductModel : one to many

CategoryModel.hasMany(ProductModel, {
  foreignKey: {
    name: "categoryId",
  },
});

ProductModel.belongsTo(CategoryModel, {
  foreignKey: {
    name: "categoryId",
  },
});

//ManufactureModel vs ProductModel: one to many

ManufactureModel.hasMany(ProductModel, {
  foreignKey: {
    name: "manufactureId",
  },
});

ProductModel.belongsTo(ManufactureModel, {
  foreignKey: {
    name: "manufactureId",
  },
});
//ReviewModel vs ProductModel: one to many

ProductModel.hasMany(ReviewModel, {
  foreignKey: {
    name: "productId",
  },
});

ReviewModel.belongsTo(ProductModel, {
  foreignKey: {
    name: "productId",
  },
});

//imageProduct vs ProductModel: one to one

imageProduct.hasOne(ProductModel, {
  foreignKey: {
    name: "imageId",
  },
});

ProductModel.belongsTo(imageProduct, {
  foreignKey: {
    name: "imageId",
  },
});

//ReviewModel vs UserModel: one to many

UserModel.hasMany(ReviewModel, {
  foreignKey: {
    name: "userId",
  },
});

ReviewModel.belongsTo(UserModel, {
  foreignKey: {
    name: "userId",
  },
});

//ManufactureModel vs CategoryModel: one to many

CategoryModel.hasMany(ManufactureModel, {
  foreignKey: {
    name: "categoryId",
  },
});

ManufactureModel.belongsTo(CategoryModel, {
  foreignKey: {
    name: "categoryId",
  },
});
avatarUser.sync();
AccountModel.sync();
CategoryModel.sync();
ManufactureModel.sync();
UserModel.sync();
imageProduct.sync();
ProductModel.sync();
OrderModel.sync();
OrderdetailModel.sync();
CartModel.sync();
PayModel.sync();
ReviewModel.sync();

module.exports = {
  UserModel,
  AccountModel,
  ProductModel,
  ManufactureModel,
  CategoryModel,
  OrderdetailModel,
  OrderModel,
  CartModel,
  PayModel,
  avatarUser,
  imageProduct,
};
