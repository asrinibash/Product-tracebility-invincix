const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { auth, checkRole } = require("../middleware/auth");

router.post(
  "/",
  auth,
  checkRole(["farmer", "manufacturer"]),
  productController.addProduct
);

router.patch(
  "/:productId/status",
  auth,
  checkRole(["farmer", "manufacturer", "distributor", "retailer"]),
  productController.updateProductStatus
);

router.get("/:productId/trace", productController.getProductTrace);

router.get("/:productId", productController.getProductById);

router.get("/:currentOwner", productController.getProductsByOwner);

router.get("/", productController.getAllProducts);

module.exports = router;
