const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).json({
            err: errors.array()[0].msg
        })
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "Not able to save user in db"
            })
        } else {
            return res.json({
                name: user.name,
                email: user.email,
                id: user._id,
                role: user.role
            })
        }
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            err: errors.array()[0].msg
        })
    }

    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User email doesn't exist"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(402).json({
                err: "Email and Password doesn't match"
            })
        }

        // create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRETKEY)
        // put token into cookie
        res.cookie("token", token, { expire: new Date() + 100 });
        const { _id, email, name, role } = user;

        // return user
        return res.status(200).json({
            token, user: {
                _id, name, email, role
            }
        })

    })
}


exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ messages: "user is loggged out" })
}

// protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRETKEY,
    algorithms: ["HS256"],
    userProperty: "auth"
})

// custom middleware
exports.isAuthenticated = (req, res, next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            error: "You are not authenticated"
        })
    } else {
        next();
    }
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Your are not an admin, Access admin"
        })
    } else {
        next();
    }
}