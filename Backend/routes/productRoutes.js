// routes/productRoutes.js
const express = require("express");
const {
  createProduct,
  updateProductStage,
  getProductTraceability,
  getAllProductsByUserId,
  getAllProducts,
  getProductView
} =require('../controllers/productController')

const router = express.Router();

router.post("/create", createProduct);
router.get("/", getAllProducts);
router.put("/update/:productId", updateProductStage);
router.get("/trace/:productId", getProductTraceability);
router.get("/user/:userType/:userId", getAllProductsByUserId);
router.get('/view/:productId', getProductView);

module.exports = router;
