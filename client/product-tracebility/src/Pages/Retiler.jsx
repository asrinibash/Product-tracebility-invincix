import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Leaf,
  Package,
  ShoppingCart,
  User,
  Plus,
  Edit,
  RefreshCw,
  BoxesIcon,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Users,
  Clock,
  Store
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {server} from "../main.jsx"


const RetailerProfile = {
  retailerId: "RETAIL-001",
  name: "SuperMart",
  storeLocation: "San Francisco, California, USA",
  shelfDate: "2024-11-15T00:00:00.000Z",
  stock: 100,
  establishedYear: "1995",
  storeSize: "45,000 sq ft",
  operatingHours: "7:00 AM - 11:00 PM",
  departments: ["Grocery", "Produce", "Meat", "Dairy", "Bakery"],
  customerFootfall: "2,500 daily",
  certifications: ["Food Safety Certified", "Green Business Certified"],
  metrics: {
    avgDailySales: "$45,000",
    inventoryTurnover: "15 days",
    customerSatisfaction: "4.7/5"
  }
};

const RetailerProfileCard = () => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-purple-600" />
          Retailer Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Store Name:</span>{" "}
              {RetailerProfile.name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Location:</span>{" "}
              {RetailerProfile.storeLocation}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BoxesIcon className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Retailer ID:</span>{" "}
              {RetailerProfile.retailerId}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Established:</span>{" "}
              {RetailerProfile.establishedYear}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Operating Hours:</span>{" "}
              {RetailerProfile.operatingHours}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Store Size:</span>{" "}
              {RetailerProfile.storeSize}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Daily Footfall:</span>{" "}
              {RetailerProfile.customerFootfall}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Departments:</span>{" "}
              <div className="flex flex-wrap gap-1 mt-1">
                {RetailerProfile.departments.map((department, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {department}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-start space-x-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <span className="font-medium">Store Performance</span>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">Average Daily Sales</p>
                  <p className="text-lg font-semibold text-purple-600">{RetailerProfile.metrics.avgDailySales}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">Inventory Turnover</p>
                  <p className="text-lg font-semibold text-orange-600">{RetailerProfile.metrics.inventoryTurnover}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Customer Satisfaction</p>
                  <p className="text-lg font-semibold text-green-600">{RetailerProfile.metrics.customerSatisfaction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RetailerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${server}/api/products/user/distributor/DIST-001`
      );
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${server}/api/orders/user/${RetailerProfile.retailerId}`
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const UpdateProductModal = ({ product, fetchProducts, onClose }) => {
    // State to capture additional input fields for Retailer stage
    const [updateData, setUpdateData] = useState({
      retailerId: "RETAIL-001",
      name: "SuperMart",
      storeLocation: "San Francisco, California, USA",
      shelfDate: "2024-11-15",
      stock: 100,
      details: "",
    });
  
    // Handler for input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdateData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    // Handler for the update status action
    const handleUpdateStatus = async () => {
      const payload = {
        stage: "Retailer",
        updateData: {
          retailerId: updateData.retailerId || "RETAIL-001",
          name: updateData.name || "SuperMart",
          storeLocation: updateData.storeLocation || "San Francisco, California, USA",
          shelfDate: updateData.shelfDate || new Date().toISOString().split("T")[0],
          stock: updateData.stock || 100,
          details: updateData.details || "",
        },
      };
  
      try {
        await fetch(`${server}/api/products/update/${product.productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (typeof fetchProducts === "function") {
          await fetchProducts();
        }
        toast.success("Operation successfull!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onClose();
      } catch (error) {
        toast.error("Operation Failed!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error updating product:", error);
      }
    };
  
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Retailer Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Product ID: {product.productId}</h3>
            <p>Name: {product.productName}</p>
            <p>Variety: {product.farmer.cropDetails.variety}</p>
            <p>Organic: {product.farmer.cropDetails.organic ? "Yes" : "No"}</p>
            <p>Location: {product.farmer.farmLocation}</p>
          </div>
          {/* Input for Retailer Name */}
          <div>
            <Label>Retailer Name</Label>
            <Input
              type="text"
              name="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder="e.g., SuperMart"
            />
          </div>
          {/* Input for Store Location */}
          <div>
            <Label>Store Location</Label>
            <Input
              type="text"
              name="storeLocation"
              value={updateData.storeLocation}
              onChange={handleChange}
              placeholder="e.g., San Francisco, California, USA"
            />
          </div>
          {/* Input for Shelf Date */}
          <div>
            <Label>Shelf Date</Label>
            <Input
              type="date"
              name="shelfDate"
              value={updateData.shelfDate}
              onChange={handleChange}
            />
          </div>
          {/* Input for Stock */}
          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              name="stock"
              value={updateData.stock}
              onChange={handleChange}
              placeholder="e.g., 100"
            />
          </div>
          {/* Input for Details */}
          <div>
            <Label>Details</Label>
            <Input
              type="text"
              name="details"
              value={updateData.details}
              onChange={handleChange}
              placeholder="Enter details about the stock and shelving"
            />
          </div>
          <Button onClick={handleUpdateStatus}>Update Product Status</Button>
        </div>
      </DialogContent>
    );
  };

  const OrdersListCard = () => {
    const [orders, setOrders] = useState([]); // Local state to hold orders
    const [loading, setLoading] = useState(true); // Loading state to show a loading indicator
  
    useEffect(() => {
      // Fetch orders from the API on component mount
      const fetchOrders = async () => {
        try {
          const response = await fetch(`${server}/api/orders/user/RETAIL-001`);
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await response.json();
          setOrders(data); // Set the fetched orders to the state
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false); // Stop loading indicator
        }
      };
  
      fetchOrders(); // Call the fetchOrders function
    }, []); // Empty dependency array to run this only once on component mount
  
    // If the data is still loading, show a loading message or spinner
    if (loading) {
      return <div>Loading orders...</div>;
    }
  
    const updateOrderStatus = async (orderNumber, newStatus) => {
      try {
        const response = await fetch(`${server}/api/orders/${orderNumber}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
  
        if (response.ok) {
          // Update the order status in local state
          setOrders(orders.map((order) =>
            order.orderNumber === orderNumber
              ? { ...order, status: newStatus }
              : order
          ));
          toast.success("Opeartion success!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Operation Failed!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating order status');
      }
    };
  
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div>No orders found</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id} // Use unique order ID
                  className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        From: {order.from_Id} &gt; To: {order.to_Id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Product: {order.productName} (ID: {order.productId})
                      </p>
                      <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                      <p className="text-sm text-blue-600 font-medium">
                        ${order.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-yellow-600 font-medium capitalize">
                        Status: {order.status}
                      </p>
                    </div>
                    <div>
                      {/* Button to update the status */}
                      <Button
                        onClick={() => updateOrderStatus(order.orderNumber, 'accepted')}
                        variant="outline"
                        size="small"
                        disabled={order.status === 'accepted'}
                      >
                        Mark as Accepted
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const CreateOrderModal = () => {
    const [orderData, setOrderData] = useState({
      to_Id: "",
      from_Id: RetailerProfile.retailerId, // Manufacturer ID from the profile
      productId: "", // product id
      productName: "", // product name
      quantity: 0, // product quantity
      price: 0, // product price
    });
  
    // Calculate the total amount dynamically (for now it's price * quantity)
    const calculateTotalAmount = () => {
      return orderData.quantity * orderData.price;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const totalAmount = calculateTotalAmount();
  
      const payload = {
        ...orderData,
        totalAmount, // Add the total amount
      };
  
      try {
        // Send the POST request to create the order
        await fetch(`${server}/api/orders/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        // Refresh the orders after successful creation
        fetchOrders();
        toast.success("Operation success!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Close the modal
        setIsCreateOrderOpen(false);
      } catch (error) {
        toast.error("Operation Failed!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error creating order:", error);
      }
    };
  
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>To ID</Label>
            <Input
              value={orderData.to_Id}
              onChange={(e) => setOrderData({ ...orderData, to_Id: e.target.value })}
            />
          </div>
          <div>
            <Label>Product ID</Label>
            <Input
              value={orderData.productId}
              onChange={(e) =>
                setOrderData({ ...orderData, productId: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Product Name</Label>
            <Input
              value={orderData.productName}
              onChange={(e) =>
                setOrderData({ ...orderData, productName: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={orderData.quantity}
                onChange={(e) =>
                  setOrderData({ ...orderData, quantity: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={orderData.price}
                onChange={(e) =>
                  setOrderData({ ...orderData, price: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <Button type="submit">Create Order</Button>
        </form>
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header with Profile Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BoxesIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Retailer Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Del Monte Blockchain based Supply Chain Portal
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Dialog
              open={isCreateOrderOpen}
              onOpenChange={setIsCreateOrderOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </DialogTrigger>
              <CreateOrderModal />
            </Dialog>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    $
                    {orders
                      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Organic Products
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      products.filter((p) => p.farmer?.cropDetails?.organic)
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <RetailerProfileCard/>

        {/* Products and Orders Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Products List */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <Dialog key={product.productId}>
                    <DialogTrigger asChild>
                      <div className="p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{product.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {product.productId}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      </div>
                    </DialogTrigger>
                    <UpdateProductModal
                      product={product}
                      onClose={() => setSelectedProduct(null)}
                    />
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <OrdersListCard/>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
