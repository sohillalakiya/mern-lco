const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product was not found in db"
                })
            } else {
                req.product = product;
                next();
            }
        })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image"
            })
        }
        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        let product = new Product(fields);

        // handle file here
        if (file.photo.size > 3000000) {
            return res.status(400).json({
                error: "File size too big!"
            })
        }

        product.photo.data = fs.readFileSync(file.photo.filepath)
        product.photo.contentType = file.photo.mimetype;

        product.save((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: "Save tshirt in DB failed!"
                })
            }
            res.status(200).json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.status(200).json(req.product);
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete product"
            })
        } else {
            return res.status(200).json({
                message: "Product delete successfull"
            })
        }
    });
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image"
            })
        }

        let product = req.product;
        product = _.extend(product, fields)

        // handle file here
        if (file.photo.size > 3000000) {
            return res.status(400).json({
                error: "File size too big!"
            })
        }

        product.photo.data = fs.readFileSync(file.photo.filepath)
        product.photo.contentType = file.photo.mimetype;

        product.save((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: "Failed to update product"
                })
            }
            res.status(200).json(product)
        })
    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .limit(limit)
        .sort([[sortBy, "asc"]])
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No Products found"
                })
            }
            else {
                return res.status(400).json(products)
            }
        })


}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count } }
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next();
    })
}

exports.getAllUniqueCategories = (req, res, next) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No Category Found"
            })
        } else {
            return res.status(200).json(category)
        }
    })
}