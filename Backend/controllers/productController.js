const Product = require("../models/Product");
const QRCode = require("qrcode");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { productId, productName, aftername, farmer } = req.body;

    // Create new product instance
    const product = new Product({
      productId,
      productName,
      aftername,
      farmer,
      traceabilityHistory: [
        {
          stage: "Farm",
          timestamp: new Date(),
          details: "Product registered at farm.",
        },
      ],
    });

    // Save the product (QR code will be generated in pre-save hook)
    const savedProduct = await product.save();
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update product stage
exports.updateProductStage = async (req, res) => {
  const { productId } = req.params;
  const { stage, updateData } = req.body;

  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the respective stage
    switch (stage.toLowerCase()) {
      case "manufacturer":
        product.manufacturer = updateData;
        break;
      case "distributor":
        product.distributor = updateData;
        break;
      case "retailer":
        product.retailer = updateData;
        break;
      default:
        return res.status(400).json({ message: "Invalid stage" });
    }

    // Add to traceability history
    product.traceabilityHistory.push({
      stage,
      timestamp: new Date(),
      details: updateData.details || `Updated ${stage} information`,
    });

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product stage:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductTraceability = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products by user ID
exports.getAllProductsByUserId = async (req, res) => {
  const { userId, userType } = req.params;

  try {
    let query = {};
    
    switch (userType.toLowerCase()) {
      case "farmer":
        query = { "farmer.farmerId": userId };
        break;
      case "manufacturer":
        query = { "manufacturer.manufacturerId": userId };
        break;
      case "distributor":
        query = { "distributor.distributorId": userId };
        break;
      case "retailer":
        query = { "retailer.retailerId": userId };
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    const products = await Product.find(query);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this user" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products by user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getProductView = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).send('<h1>Product Not Found</h1>');
    }

    // Send HTML response
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${product.productName} - Product Details</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 16px;
                  background: #f5f5f5;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  padding-bottom: 16px;
                  border-bottom: 1px solid #eee;
                  margin-bottom: 20px;
              }
              .product-name {
                  font-size: 24px;
                  color: #333;
                  margin: 0;
              }
              .product-id {
                  color: #666;
                  font-size: 14px;
              }
              .section {
                  margin-bottom: 24px;
              }
              .section-title {
                  font-size: 18px;
                  color: #2c5282;
                  margin-bottom: 8px;
              }
              .info-grid {
                  display: grid;
                  grid-template-columns: auto 1fr;
                  gap: 8px;
                  font-size: 14px;
              }
              .label {
                  font-weight: bold;
                  color: #4a5568;
              }
              .value {
                  color: #2d3748;
              }
              .timeline {
                  margin-top: 24px;
              }
              .timeline-item {
                  padding: 12px 0;
                  border-left: 2px solid #2c5282;
                  margin-left: 16px;
                  padding-left: 16px;
                  position: relative;
              }
              .timeline-item::before {
                  content: '';
                  width: 12px;
                  height: 12px;
                  background: #2c5282;
                  border-radius: 50%;
                  position: absolute;
                  left: -7px;
                  top: 16px;
              }
              .timeline-date {
                  font-size: 12px;
                  color: #666;
              }
              .organic-badge {
                  background: #48bb78;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  display: inline-block;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1 class="product-name">${product.productName} (${product.aftername})</h1>
                  <div class="product-id">Product ID: ${product.productId}</div>
                  ${product.farmer?.cropDetails?.organic ? '<span class="organic-badge">Organic</span>' : ''}
              </div>
              
              <div class="section">
                  <h2 class="section-title">Farm Details</h2>
                  <div class="info-grid">
                      <span class="label">Farm Name:</span>
                      <span class="value">${product.farmer?.name || 'N/A'}</span>
                      <span class="label">Location:</span>
                      <span class="value">${product.farmer?.farmLocation || 'N/A'}</span>
                      <span class="label">Harvest Date:</span>
                      <span class="value">${new Date(product.farmer?.harvestDate).toLocaleDateString() || 'N/A'}</span>
                  </div>
              </div>

              <div class="section">
                  <h2 class="section-title">Manufacturing</h2>
                  <div class="info-grid">
                      <span class="label">Manufacturer:</span>
                      <span class="value">${product.manufacturer?.name || 'N/A'}</span>
                      <span class="label">Location:</span>
                      <span class="value">${product.manufacturer?.location || 'N/A'}</span>
                      <span class="label">Batch Number:</span>
                      <span class="value">${product.manufacturer?.batchNumber || 'N/A'}</span>
                  </div>
              </div>

              <div class="section">
                  <h2 class="section-title">Current Location</h2>
                  <div class="info-grid">
                      <span class="label">Retailer:</span>
                      <span class="value">${product.retailer?.name || 'N/A'}</span>
                      <span class="label">Store Location:</span>
                      <span class="value">${product.retailer?.storeLocation || 'N/A'}</span>
                  </div>
              </div>

              <div class="timeline">
                  <h2 class="section-title">Product Journey</h2>
                  ${product.traceabilityHistory.map(history => `
                      <div class="timeline-item">
                          <div class="timeline-date">${new Date(history.timestamp).toLocaleString()}</div>
                          <strong>${history.stage}</strong>
                          <div>${history.details}</div>
                      </div>
                  `).join('')}
              </div>
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error getting product view:", error);
    res.status(500).send('<h1>Error loading product details</h1>');
  }
};