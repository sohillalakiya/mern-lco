const Category = require("../models/category")

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Not able to save category in db"
            })
        } else {
            return res.status(200).json(category)
        }
    })
}

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Category is not found"
            })
        } else {
            req.category = category
            next();
        }
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err || !categories) {
            return res.status(400).json({
                error: "No categories found in db"
            })
        } else {
            return res.status(200).json(categories)
        }
    })
}

exports.updateCategory = (req, res) => {
    let category = req.category;
    category.name = req.body.name;

    category.save((err, category) => {
        if (err || !category) {
            return res.status(403).json({
                error: "Not able to update category"
            })
        } else {
            return res.status(200).json(category)
        }
    })
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Can not delete category"
            })
        } else {
            return res.status(200).json({
                message: `${category.name} Category Successfully deleted`
            })
        }
    })
}