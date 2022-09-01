const { UserModel, AccountModel, avatarUser } = require("../models");
const sequelize = require("../models/config.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const LoginGoogle = async (req, res) => {
  const user = req.user;
  const t = await sequelize.transaction();

  try {
    //First, we start a transaction and save it into a variable

    const inforUser = await UserModel.findOne({
      where: {
        user_id: user.user_id,
      },
      include: [{ model: AccountModel }, { model: avatarUser }],
      raw: true,
    });

    if (inforUser) {
      const accesstoken = jwt.sign(
        { id: inforUser.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        message: "login successfuly",
        role: inforUser["account.role"],
        accesstoken,
        accountId: inforUser.accountId,
        userId: inforUser.id,
      });
    } else {
      const account = {};

      // Create Account
      const accoutNew = await AccountModel.create(account, { transaction: t });
      const avatar = {
        id: accoutNew.id,
        image: user.picture,
      };

      await avatarUser.create(avatar, { transaction: t });

      const profile = {
        id: accoutNew.id,
        user_id: user.user_id,
        email: user.email,
        fullName: user.name,
        accountId: accoutNew.id,
        avatarId: accoutNew.id,
      };

      // save data to DB
      const newInfor = await UserModel.create(profile, { transaction: t });

      const accesstoken = jwt.sign(
        { id: accoutNew.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "Create Successfully",
        role: accoutNew.role,
        userId: accoutNew.id,
        accountId: accoutNew.id,
        accesstoken: accesstoken,
      });
      await t.commit();
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  LoginGoogle,
};
