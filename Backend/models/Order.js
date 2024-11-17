const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  from_Id: {
    type: String,
    required: true,
  },
  to_Id: {
    type: String,
    required: true,
  },
  productId:String,
  productName:String,
  quantity: Number,
  price: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = "ORD-" + Date.now();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
