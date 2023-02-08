const User = require("../models/user");
const {Order} = require("../models/order")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        } else {
            req.profile = user;
            next();
        }
    })
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, userFindAndModify: false },
        (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "You are not authorized to update this user"
                })
            } else {
                user.salt = undefined;
                user.encry_password = undefined;
                return res.json(user)
            }
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: "Order not found"
                })
            } else {
                return res.status(200).json(order)
            }
        })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach((product) => {
        const { _id, name, description, category, quantity, amount, transaction_id } = product;
        purchases.push({
            _id, name, description, category, quantity, amount, transaction_id
        })
    })

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, purchases) => {
            if (err || !purchases) {
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            } else {
                next();
            }
        }
    )
}