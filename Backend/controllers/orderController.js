const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { products, toUserId } = req.body;

    const order = new Order({
      from: req.user._id,
      to: toUserId,
      products: products.map(p => ({
        product: p.productId,
        quantity: p.quantity,
        price: p.price
      })),
      totalAmount: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'delivered') {
      // Update product ownership and add to traceability chain
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        product.currentOwner = order.to;

        // Update specific role fields based on the recipient
        const recipient = await User.findById(order.to);
        if (recipient.role === 'manufacturer') {
          product.manufacturer = recipient._id;
        } else if (recipient.role === 'distributor') {
          product.distributor = recipient._id;
        } else if (recipient.role === 'retailer') {
          product.retailer = recipient._id;
        }

        product.traceabilityChain.push({
          actor: req.user._id,
          action: `Transferred to ${recipient.role}`,
          location: recipient.address,
          quantity: item.quantity,
          notes: `Order ${order._id} completed`
        });

        await product.save();
      }
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('from', 'name businessName')
      .populate('to', 'name businessName')
      .populate('products.product', 'name');
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('from', 'name businessName')
      .populate('to', 'name businessName')
      .populate('products.product', 'name');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get orders for a specific user
exports.getOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ to: userId })
      .populate('from', 'name businessName')
      .populate('to', 'name businessName')
      .populate('products.product', 'name');
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
