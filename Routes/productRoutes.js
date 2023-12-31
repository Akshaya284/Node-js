const productController = require('../Controllers/productController');

const express = require('express');
const router = express.Router();

router.post("/create-product", productController.createProduct);
router.put("/:id", productController.editProduct);
router.get("/:id",productController.getProductById);
router.get("/",productController.getProducts);
router.delete("/:id", productController.deleteProductById);

module.exports = router;