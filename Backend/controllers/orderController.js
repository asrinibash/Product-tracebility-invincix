const Order = require("../models/Order");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { from_Id, to_Id, productId, productName, quantity, price } =
      req.body;

    // Calculate total amount
    let totalAmount = quantity * price;

    // Create the order
    const newOrder = new Order({
      from_Id,
      to_Id,
      productId,
      productName,
      quantity,
      price,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderNumber } = req.params;
  const { status } = req.body;

  try {
    // Find the order by orderNumber
    const order = await Order.findOne({ orderNumber });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update status
    order.status = status;
    order.updatedAt = new Date();

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders by userId (either from_Id or to_Id)
exports.getAllOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find orders where userId is either from_Id or to_Id
    const orders = await Order.find({
      $or: [{ from_Id: userId }, { to_Id: userId }],
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
