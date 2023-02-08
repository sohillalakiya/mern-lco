const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { createCategory, getCategoryById, getCategory, getAllCategory, updateCategory, deleteCategory } = require("../controllers/category");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory)

module.exports = router;