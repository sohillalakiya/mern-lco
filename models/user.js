const mongoose = require("mongoose");
const crypto = require('crypto');
const {v4 : uuidv1} = require('uuid')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    userInfo: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchase: {
        type: Array,
        default: []
    }
}, { timestamps: true });

userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securedPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (plainPassword) {
        return this.securedPassword(plainPassword) === this.encry_password;
    },

    securedPassword: function (plainPassword) {
        if (!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex')
        } catch (error) {
            return "";
        }
    }
}

module.exports = mongoose.model("Users", userSchema)