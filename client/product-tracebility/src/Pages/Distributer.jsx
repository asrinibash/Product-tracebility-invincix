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
  Plus,
  Edit,
  RefreshCw,
  BoxesIcon,
  BarChart3,
  MapPin,
  CalendarClock,
  DollarSign,
  Truck,
  ClipboardList,
  ThermometerSun,
  Building2,
  Users,
  Timer
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {server} from "../main.jsx"


const DistributorProfile = {
    distributorId: "DIST-001",
    name: "Fresh Produce Distributors",
    shipmentDate: "2024-11-13T00:00:00.000Z",
    warehouseLocation: "Los Angeles, California, USA",
    deliveryDate: "2024-11-14T00:00:00.000Z",
    fleetSize: "25 vehicles",
    temperatureControl: "33°F - 39°F",
    avgDeliveryTime: "24 hours",
    activeClients: 150,
    distributionRadius: "200 miles",
    certifications: ["FDA Certified", "FSMA Compliant", "ISO 9001"],
    handlingCapacity: "50,000 lbs/day",
    performanceMetrics: {
      onTimeDelivery: "98.5%",
      orderAccuracy: "99.2%",
      customerSatisfaction: "4.8/5"
    }
  };
  
  const DistributorProfileCard = () => {
    return (
      <Card className="bg-white/50 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Distributor Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Company Name:</span>{" "}
                {DistributorProfile.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <BoxesIcon className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Distributor ID:</span>{" "}
                {DistributorProfile.distributorId}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Warehouse Location:</span>{" "}
                {DistributorProfile.warehouseLocation}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Average Delivery Time:</span>{" "}
                {DistributorProfile.avgDeliveryTime}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Active Clients:</span>{" "}
                {DistributorProfile.activeClients}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Next Shipment:</span>{" "}
                {new Date(DistributorProfile.shipmentDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ThermometerSun className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Temperature Control:</span>{" "}
                {DistributorProfile.temperatureControl}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Handling Capacity:</span>{" "}
                {DistributorProfile.handlingCapacity}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Fleet Size:</span>{" "}
                {DistributorProfile.fleetSize}
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-start space-x-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="font-medium">Performance Metrics</span>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">On-Time Delivery</p>
                    <p className="text-lg font-semibold text-green-600">{DistributorProfile.performanceMetrics.onTimeDelivery}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Order Accuracy</p>
                    <p className="text-lg font-semibold text-blue-600">{DistributorProfile.performanceMetrics.orderAccuracy}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium">Customer Satisfaction</p>
                    <p className="text-lg font-semibold text-purple-600">{DistributorProfile.performanceMetrics.customerSatisfaction}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

const DistributorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${server}/api/products/user/manufacturer/MANUF-001`
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
        `${server}/api/orders/user/${DistributorProfile.distributorId}`
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
    // State to capture additional input fields for Distributor stage
    const [updateData, setUpdateData] = useState({
      distributorId: "DIST-001",
      name: "Fresh Produce Distributors",
      shipmentDate: "2024-11-13",
      warehouseLocation: "Los Angeles, California, USA",
      deliveryDate: "2024-11-14",
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
        stage: "Distributor",
        updateData: {
          distributorId: updateData.distributorId || "DIST-001",
          name: updateData.name || "Fresh Produce Distributors",
          shipmentDate: updateData.shipmentDate || new Date().toISOString().split("T")[0],
          warehouseLocation: updateData.warehouseLocation || "Los Angeles, California, USA",
          deliveryDate: updateData.deliveryDate || new Date().toISOString().split("T")[0],
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
          <DialogTitle>Distributor Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Product ID: {product.productId}</h3>
            <p>Name: {product.productName}</p>
            <p>Variety: {product.farmer.cropDetails.variety}</p>
            <p>Organic: {product.farmer.cropDetails.organic ? "Yes" : "No"}</p>
            <p>Location: {product.farmer.farmLocation}</p>
          </div>
          {/* Input for Distributor Name */}
          <div>
            <Label>Distributor Name</Label>
            <Input
              type="text"
              name="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder="e.g., Fresh Produce Distributors"
            />
          </div>
          {/* Input for Shipment Date */}
          <div>
            <Label>Shipment Date</Label>
            <Input
              type="date"
              name="shipmentDate"
              value={updateData.shipmentDate}
              onChange={handleChange}
            />
          </div>
          {/* Input for Warehouse Location */}
          <div>
            <Label>Warehouse Location</Label>
            <Input
              type="text"
              name="warehouseLocation"
              value={updateData.warehouseLocation}
              onChange={handleChange}
              placeholder="e.g., Los Angeles, California, USA"
            />
          </div>
          {/* Input for Delivery Date */}
          <div>
            <Label>Delivery Date</Label>
            <Input
              type="date"
              name="deliveryDate"
              value={updateData.deliveryDate}
              onChange={handleChange}
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
              placeholder="Enter details about the shipment"
            />
          </div>
          <Button onClick={handleUpdateStatus}>Update Product Status</Button>
        </div>
      </DialogContent>
    );
  };
  
  const OrdersListCard = () => {
    // We can use the orders state and functions from the parent component
    // No need to duplicate the state management
    
    const updateOrderStatus = async (orderNumber, newStatus) => {
      try {
        const response = await fetch(`${server}/api/orders/${orderNumber}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
  
        if (response.ok) {
          // Refresh the orders list after successful update
          fetchOrders();
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
        toast.error("Error updating order status");
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
                  key={order._id}
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
      from_Id: DistributorProfile.distributorId, // Manufacturer ID from the profile
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
        toast.success("Operation successfull!", {
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
              <h1 className="text-2xl font-bold">Distributer Dashboard</h1>
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
        <DistributorProfileCard/>

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

export default DistributorDashboard;
