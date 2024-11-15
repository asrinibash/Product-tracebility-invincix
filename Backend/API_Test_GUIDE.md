# Product Traceability System - Testing Guide

## Setup Instructions

1. Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traceability
JWT_SECRET=your_jwt_secret_key
```

2. Install dependencies:
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv qrcode
```

3. Start the server:
```bash
npm start
```

## Testing Flow

### 1. User Registration & Authentication

#### Register Farmer
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "farmer@test.com",
  "password": "password123",
  "name": "John Farmer",
  "role": "farmer",
  "businessName": "Green Farms",
  "address": {
    "street": "123 Farm Road",
    "city": "Farmville",
    "state": "AG",
    "country": "USA",
    "pincode": "12345"
  },
  "phone": "1234567890"
}'
```

#### Register Manufacturer
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "manufacturer@test.com",
  "password": "password123",
  "name": "Mike Manufacturer",
  "role": "manufacturer",
  "businessName": "Food Processing Co",
  "address": {
    "street": "456 Factory Lane",
    "city": "Industrial City",
    "state": "IC",
    "country": "USA",
    "pincode": "67890"
  },
  "phone": "9876543210"
}'
```

[Similarly register distributor, retailer, and consumer]

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "farmer@test.com",
  "password": "password123"
}'
```

### 2. Product Management

#### Add Product (as Farmer)
```bash
curl -X POST http://localhost:5000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "name": "Organic Wheat",
  "description": "Premium quality organic wheat",
  "category": "Grains",
  "basePrice": 100,
  "quantity": 1000,
  "unit": "kg",
  "batchNumber": "WHEAT-2024-001"
}'
```

#### Update Product Status
```bash
curl -X PATCH http://localhost:5000/api/products/PRODUCT_ID/status \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "status": "processing",
  "notes": "Starting wheat processing"
}'
```

### 3. Order Management

#### Create Order (Manufacturer ordering from Farmer)
```bash
curl -X POST http://localhost:5000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "toUserId": "FARMER_USER_ID",
  "products": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 500,
      "price": 100
    }
  ]
}'
```

#### Update Order Status
```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "status": "delivered"
}'
```

### 4. Traceability Check

#### Get Product Trace
```bash
curl -X GET http://localhost:5000/api/products/PRODUCT_ID/trace \
-H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Sequence

1. Register all types of users (farmer, manufacturer, distributor, retailer, consumer)
2. Login with farmer account and create products
3. Login with manufacturer account and create order from farmer
4. Update order status to delivered (transfers ownership)
5. Manufacturer processes product and creates new manufactured product
6. Distributor orders from manufacturer
7. Continue chain until product reaches retailer
8. Check product trace at any point to verify chain

## Expected Results

1. User Registration:
- Should receive JWT token
- User should be saved in database

2. Product Creation:
- Should generate QR code
- Should create initial traceability entry

3. Order Creation:
- Should calculate total amount
- Should link products correctly

4. Order Delivery:
- Should transfer product ownership
- Should update traceability chain

5. Product Trace:
- Should show complete chain of custody
- Should include all stakeholders involved

## Common Issues & Troubleshooting

1. Authentication Errors:
- Verify JWT token is included in headers
- Check token expiration
- Verify user role permissions

2. Product Updates:
- Ensure product exists
- Verify user has permission for the action
- Check all required fields are provided

3. Order Creation:
- Verify product availability
- Check quantity validation
- Ensure proper role permissions

4. Database Issues:
- Check MongoDB connection
- Verify indexes are created
- Check for duplicate key errors

## Monitoring

Monitor the server console for:
- Connection success/failure messages
- API request logs
- Error stack traces
- Database operation logs