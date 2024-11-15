const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth, checkRole } = require("../middleware/auth");

router.post(
  "/",
  auth,
  checkRole(["manufacturer", "distributor", "retailer"]),
  orderController.createOrder
);

router.patch(
  "/:orderId/status",
  auth,
  checkRole(["farmer", "manufacturer", "distributor", "retailer"]),
  orderController.updateOrderStatus
);

router.get("/", orderController.getAllOrders);

router.get("/:orderId", orderController.getOrderById);

router.get('/user-orders/:userId', orderController.getOrdersForUser);

module.exports = router;
