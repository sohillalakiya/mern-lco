const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {signout,signup,signin, isSignedIn} = require("../controllers/auth")

router.post('/signup',[
    check("name").isLength({min: 3}).withMessage('name at least 3 chars long'),
    check("email").isEmail().withMessage('Email is required'),
    check("password").isLength({min: 6}).withMessage('password at least 6 chars long')
], signup);

router.post('/signin',[
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min: 1}).withMessage("Enter password")
],signin);

router.get('/signout', signout);

router.get("/test", isSignedIn, (req,res) => {
    res.status(200).json({
        id: req.auth
    })
})

module.exports = router;