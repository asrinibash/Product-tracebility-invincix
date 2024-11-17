const mongoose = require("mongoose");
const QRCode = require('qrcode');

const traceabilitySchema = new mongoose.Schema({
  stage: String,
  timestamp: Date,
  details: String,
});

const productSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  qrCode: {
    type: String,
    default: '' // Set a default value instead of required: true
  },
  aftername: {
    type: String,
    required: true,
  },
  farmer: {
    farmerId: String,
    name: String,
    farmLocation: String,
    harvestDate: Date,
    cropDetails: {
      variety: String,
      pesticidesUsed: Boolean,
      organic: Boolean,
    },
  },
  manufacturer: {
    manufacturerId: String,
    name: String,
    location: String,
    productionDate: Date,
    ingredients: [String],
    batchNumber: String,
  },
  distributor: {
    distributorId: String,
    name: String,
    shipmentDate: Date,
    warehouseLocation: String,
    deliveryDate: Date,
  },
  retailer: {
    retailerId: String,
    name: String,
    storeLocation: String,
    shelfDate: Date,
    stock: Number,
  },
  expirationDate: Date,
  traceabilityHistory: [traceabilitySchema],
});

// Generate QR code before saving
productSchema.pre("save", async function(next) {
  try {
    // Generate comprehensive QR code data
    const qrData = JSON.stringify({
      productId: this.productId,
      productName: this.productName,
      aftername: this.aftername,
      // Only include essential tracking data
      tracking: {
        farm: {
          name: this.farmer?.name,
          location: this.farmer?.farmLocation,
          harvestDate: this.farmer?.harvestDate,
          organic: this.farmer?.cropDetails?.organic
        },
        manufacturer: {
          name: this.manufacturer?.name,
          location: this.manufacturer?.location,
          productionDate: this.manufacturer?.productionDate,
          batchNumber: this.manufacturer?.batchNumber
        },
        currentLocation: this.retailer?.storeLocation || this.distributor?.warehouseLocation,
      },
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/product-view/${this.productId}`
    });
    
    // Generate QR code
    this.qrCode = await QRCode.toDataURL(qrData);
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;