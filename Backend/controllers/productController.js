const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      quantity,
      unit,
      batchNumber,
      manufacturingDate,
      expiryDate
    } = req.body;

    const product = new Product({
      name,
      description,
      category,
      basePrice,
      quantity,
      unit,
      batchNumber,
      manufacturingDate,
      expiryDate,
      currentOwner: req.user._id,
      originalFarmer: req.user.role === 'farmer' ? req.user._id : null
    });

    await product.save();

    // Add initial traceability entry
    product.traceabilityChain.push({
      actor: req.user._id,
      action: 'Product created',
      location: req.user.address,
      quantity: quantity,
      notes: 'Initial product registration'
    });

    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product status
exports.updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = status;
    product.traceabilityChain.push({
      actor: req.user._id,
      action: `Status updated to ${status}`,
      location: req.user.address,
      notes
    });

    await product.save();

    res.json({
      message: 'Product status updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product traceability
exports.getProductTrace = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId)
      .populate('currentOwner', 'name businessName')
      .populate('originalFarmer', 'name businessName')
      .populate('manufacturer', 'name businessName')
      .populate('distributor', 'name businessName')
      .populate('retailer', 'name businessName')
      .populate('traceabilityChain.actor', 'name businessName role');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('currentOwner', 'name businessName');
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get products of the current owner
exports.getProductsByOwner = async (req, res) => {
  try {
    const products = await Product.find({ currentOwner: req.user._id }).populate('currentOwner', 'name businessName');
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('currentOwner', 'name businessName');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
