const mongoose = require('mongoose');
const QRCode = require('qrcode');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  category: String,
  basePrice: Number,
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFarmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['raw', 'processing', 'manufactured', 'in_transit', 'at_distributor', 'at_retailer', 'sold'],
    default: 'raw'
  },
  qrCode: { 
    type: String, 
    unique: true 
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: String,
  batchNumber: String,
  manufacturingDate: Date,
  expiryDate: Date,
  traceabilityChain: [{
    timestamp: { type: Date, default: Date.now },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: String,
    location: String,
    quantity: Number,
    notes: String
  }]
});

productSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    const qrData = {
      productId: this._id,
      name: this.name,
      batchNumber: this.batchNumber
    };
    this.qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;