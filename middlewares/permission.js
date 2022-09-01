const permission = require("../config/permission");
const { AccountModel } = require("../models");


const isAdmin = async (req, res, next) => {
    const id = req.id;
    const account = await AccountModel.findOne({
        where: {
            id
        }
    })

    if (account) {

        if (account.role !== permission.admin) {
            return res.status(401).json({ message: "Unauthorized! You must have Admin Role to access" })
        }
        next();
    }
}

const isMember = async (req, res, next) => {
    const { id } = req.user;

    const account = await AccountModel.findOne({
        where: {
            id,
        }
    })

    if (account) {
        // check user in data is admin, isn't he?
        if (account.role !== permission.member) {
            return res.status(401).json({ message: "Unauthorized! You must have Memeber Role to access" })
        }
        next();
    }
}

module.exports = {
    isAdmin,
    isMember
}