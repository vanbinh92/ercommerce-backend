const bcrypt = require("bcrypt");
const fs = require("fs");

const { UserModel, AccountModel, avatarUser } = require("../models");
const sequelize = require("../models/config.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudinary");

const getInfor = async (req, res) => {
  try {
    const { accountId } = req.params;
    const inforUser = await UserModel.findOne({
      where: {
        accountId,
      },
      include: [{ model: AccountModel }, { model: avatarUser }],
      raw: true,
    });
    delete inforUser["account.hashPwd"];
    if (!inforUser) {
      return res.status(404).json({ message: "Not Found Information User" });
    }

    res
      .status(200)
      .json({ message: "Get information User successfully", inforUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getInforByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = await UserModel.findOne({
      where: { id: userId },
      include: [
        { model: AccountModel },
        {
          model: avatarUser,
        },
      ],
      raw: true,
    });
    if (!User) {
      return res.status(404).json({ message: "not found information User" });
    }
    res.status(200).json({ message: "get information successfully", User });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getAllInfor = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      include: [{ model: AccountModel }, { model: avatarUser }],
      raw: true,
    });
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const createNewInfor = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { fullname, email, address, phone, username, password } = req.body;

    // First, we start a transaction and save it into a variable

    const found = await AccountModel.findOne(
      {
        where: {
          username,
        },
      },
      { transaction: t }
    );
    if (found) {
      return res.status(409).json({ message: "username has existed" });
    }
    // validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password is at least 6 characters long." });
    }

    //password Encryption
    const passwordHash = await bcrypt.hash(password, 10);

    const account = {
      username: username,
      hashPwd: passwordHash,
    };

    // SAVE ACCOUNT
    const newAccount = await AccountModel.create(account, { transaction: t });
    
    // prevent hashPash from showing on UI
    delete newAccount.dataValues.hashPwd;

    const avatar = {
      id: newAccount.id,
    };

    // save data to DB
    const newAvatar = await avatarUser.create(avatar, { transaction: t });

    const profile = {
      id: newAccount.id,
      fullName: fullname,
      email,
      address,
      phone,
      accountId: newAccount.id,
      avatarId: newAvatar.id,
    };

    // save data to DB
    const newInfor = await UserModel.create(profile, { transaction: t });

    const accesstoken = jwt.sign(
      { data: newInfor },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Create Successfully",
      newInfor,
      newAccount,
      accesstoken,
    });
    await t.commit();
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};
const createNewInforByAdmin = async (req, res) => {
  const t = await sequelize.transaction();
  function base64_encode(file) {
    return "data:image/gif;base64," + fs.readFileSync(file, "base64");
  }

  try {
    const { fullName, email, address, phone, username, password } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(404).json({ message: "Pls provide an image" });
    }
    // First, we start a transaction and save it into a variable

    const found = await AccountModel.findOne(
      {
        where: {
          username,
        },
      },
      { transaction: t }
    );
    if (found) {
      return res.status(409).json({ message: "username has existed" });
    }
    // validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password is at least 6 characters long." });
    }

    //password Encryption
    const passwordHash = await bcrypt.hash(password, 10);

    const account = {
      username: username,
      hashPwd: passwordHash,
    };

    // SAVE ACCOUNT
    const newAccount = await AccountModel.create(account, { transaction: t });
    // prevent hashPash from showing on UI
    delete newAccount.dataValues.hashPwd;

    // save data to DB

    const base64str = base64_encode(file.path);
    const uploadCloud = await cloudinary.uploader.upload(base64str, {
      upload_preset: "products",
    });

    const avatar = {
      id: newAccount.id,
      image_id: uploadCloud.public_id,
      image: uploadCloud.url,
    };
    await avatarUser.create(avatar, { transaction: t });

    const profile = {
      fullName,
      email,
      address,
      phone,
      avatar: base64str,
      accountId: newAccount.id,
      avatarId: newAccount.id,
    };

    // save data to DB
    const newInfor = await UserModel.create(profile, { transaction: t });

    res
      .status(201)
      .json({ message: "Created new User successfully", newInfor, newAccount });

    // COMMIT TRANSACTION
    await t.commit();
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};
const updateInfor = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { fullName, address } = req.body;

    const update = {
      fullName,
      address,
    };

    const foundInfor = await UserModel.findOne({
      where: {
        accountId,
      },
    });

    if (!foundInfor) {
      return res.status(404).json({ message: "Not Found Information User" });
    }

    const updateInfor = await UserModel.update(update, {
      where: {
        accountId,
      },
    });

    if (!updateInfor) {
      return res.status(400).json({ message: "update fail User" });
    }

    res.status(200).json({ message: "update succesfully User" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateInforByAdmin = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { fullName, address, role } = req.body;
    const foundInfor = await UserModel.findOne({
      where: {
        id: userId,
      },
    });
    if (!foundInfor) {
      return res.status(404).json({ message: "Not Found Information User" });
    }
    await UserModel.update(
      { fullName: fullName, address: address },
      { where: { id: userId } }
    ),
      { transaction: t };
    const foundAccount = await AccountModel.findOne({
      where: { id: foundInfor.accountId },
    });
    if (!foundAccount) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Not Found Information Account " });
    }
    await AccountModel.update(
      { role: role },
      { where: { id: foundInfor.accountId } }
    ),
      res.status(201).json({ message: "updated User successfully" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

const removeInfor = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const foundInfor = await UserModel.findOne(
      {
        where: {
          id: userId,
        },
      },
      { transaction: t }
    );

    if (!foundInfor) {
      return res.status(404).json({ message: "not found information User" });
    }
    await UserModel.destroy(
      {
        where: {
          id: userId,
        },
      },
      { transaction: t }
    );
    const foundAccount = await AccountModel.findOne(
      {
        where: {
          id: foundInfor.accountId,
        },
      },
      { transaction: t }
    );
    if (!foundAccount) {
      await t.rollback();
      return res.status(404).json({ message: "not found information Account" });
    }
    await AccountModel.destroy(
      {
        where: {
          id: foundInfor.accountId,
        },
      },
      { transaction: t }
    );
    res.json({ message: "delete successfully" });
    await t.commit();
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  function base64_encode(file) {
    return "data:image/gif;base64," + fs.readFileSync(file, "base64");
  }
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(401).json({ message: "Pls provide an image" });
    }

    const found = await UserModel.findOne({
      where: {
        id,
      },
      include: [{ model: avatarUser }],
      raw: true,
    });

    if (!found) {
      return res.status(404).json({ message: "Not Found User" });
    }
    if (found["avatarUser.image_id"]) {
      const imgId = found["avatarUser.image_id"];
      await cloudinary.uploader.destroy(imgId);
    }

    const base64str = base64_encode(file.path);
    const uploadCloud = await cloudinary.uploader.upload(base64str, {
      upload_preset: "products",
    });

    await avatarUser.update(
      { image: uploadCloud.url, image_id: uploadCloud.public_id },
      { where: { id: found.id } }
    );

    res.json({ message: "avatar uploaded", avatar: uploadCloud.url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInfor,
  getInforByAdmin,
  createNewInfor,
  updateInfor,
  removeInfor,
  uploadAvatar,
  getAllInfor,
  createNewInforByAdmin,
  updateInforByAdmin,
};
