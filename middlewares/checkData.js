const { UserModel } = require("../models");

const checkPhone = async (req, res, next) => {
    const { phone } = req.body;
    const foundPhone = await UserModel.findOne({
        where: {
            phone
        }
    })
    if (foundPhone) {
        return res.status(409).json({ message: "Phone number existed" })
    }
    next();
}

const checkEmail = async (req, res, next) => {
    const { email } = req.body;
    const foundEmail = await UserModel.findOne({
        where: {
            email
        }
    })
    if (foundEmail) {
        return res.status(409).json({ message: "Email existed" })
    }
    next();
}

module.exports = {
    checkEmail,
    checkPhone
}