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
  Box,
  BoxesIcon,
  Badge,
  MapPin,
  Calendar,
  DollarSign, 
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const farmerProfile = {
  farmerId: "FARM-001",
  name: "John Doe Farms",
  farmLocation: "Fresno, California, USA",
  harvestDate: "2024-11-10T00:00:00.000Z",
  cropDetails: {
    variety: "Roma",
    pesticidesUsed: false,
    organic: true,
  },
};

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/user/farmer/${farmerProfile.farmerId}`
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
        `http://localhost:8080/api/orders/user/${farmerProfile.farmerId}`
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

  const OrdersListCard = () => {
    const [orders, setOrders] = useState([]); // Local state to hold orders
    const [loading, setLoading] = useState(true); // Loading state to show a loading indicator
  
    useEffect(() => {
      // Fetch orders from the API on component mount
      const fetchOrders = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/orders/user/FARM-001');
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
        const response = await fetch(`http://localhost:8080/api/orders/${orderNumber}/status`, {
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
          toast.success("Status updated!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Operation unsuccessful!", {
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

  const CreateProductModal = ({
    farmerProfile,
    fetchProducts,
    setIsCreateProductOpen,
  }) => {
    const [productData, setProductData] = useState({
      productId: "",
      productName: "",
      aftername: "",
      farmer: {
        farmerId: farmerProfile?.farmerId || "",
        name: farmerProfile?.name || "",
        farmLocation: farmerProfile?.farmLocation || "",
        harvestDate: "",
        cropDetails: {
          variety: "",
          pesticidesUsed: false,
          organic: false,
        },
      },
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await fetch("http://localhost:8080/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        // Correctly call fetchProducts
        if (typeof fetchProducts === "function") {
          fetchProducts();
        }
        toast.success("Smart Contract created for Product..", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsCreateProductOpen(false);
      } catch (error) {
        toast.error("Error Creating Product!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error creating product:", error);
      }
    };

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Product ID</Label>
            <Input
              name="productId"
              value={productData.productId}
              onChange={(e) =>
                setProductData({ ...productData, productId: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Product Name</Label>
            <Input
              name="productName"
              value={productData.productName}
              onChange={(e) =>
                setProductData({ ...productData, productName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Aftername</Label>
            <Input
              name="aftername"
              value={productData.aftername}
              onChange={(e) =>
                setProductData({ ...productData, aftername: e.target.value })
              }
            />
          </div>
          <Button type="submit">Create Product</Button>
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
              <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Del Monte Supply Chain Portal
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Dialog
              open={isCreateProductOpen}
              onOpenChange={setIsCreateProductOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Product
                </Button>
              </DialogTrigger>
              <CreateProductModal
                farmerProfile={farmerProfile}
                fetchProducts={fetchProducts} // Make sure this is the correct function
                setIsCreateProductOpen={setIsCreateProductOpen}
              />
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
        <Card className="bg-white/50 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Farmer Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {farmerProfile.name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {farmerProfile.farmLocation}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <BoxesIcon className="h-4 w-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Farmer ID:</span>{" "}
                  {farmerProfile.farmerId}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-blue-600">Crop Details:</p>
              <div className="grid grid-cols-2 gap-2">
                <p>Variety: {farmerProfile.cropDetails.variety}</p>
                <p>
                  Organic: {farmerProfile.cropDetails.organic ? "Yes" : "No"}
                </p>
                <p>
                  Pesticides:{" "}
                  {farmerProfile.cropDetails.pesticidesUsed ? "Yes" : "No"}
                </p>
                <p>
                  Harvest Date:{" "}
                  {new Date(farmerProfile.harvestDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                        </div>
                      </div>
                    </DialogTrigger>
                   
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

export default FarmerDashboard;
