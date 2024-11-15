import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, ShoppingCart } from 'lucide-react';
import { Button } from '../Components/Ui/Button';
import { Modal } from '../Components/Ui/Modal';
import { Input } from '../Components/Ui/Input';
import { StatsCard } from '../Components/Cards/StatsCard';
import { ProfileCard } from '../Components/Cards/ProfileCard';
import { InfoCard } from '../Components/Cards/InfoCard';
import { ListCard } from '../Components/Cards/ListCard';

const FarmerDashboard = () => {
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    unit: 'kg'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, productsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:8080/api/users/6735902d0864dd70e2010908'),
          fetch('http://localhost:8080/api/products'),
          fetch('http://localhost:8080/api/orders')
        ]);

        const profileData = await profileRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setUserProfile(profileData.user);
        setProducts(productsData.products);
        setOrders(ordersData.orders);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Active Orders", value: orders.filter(order => order.status === 'pending').length },
    { label: "Total Revenue", value: `$${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}` }
  ];

  const infoItems = userProfile ? [
    { icon: "📍", text: `${userProfile.address.city}, ${userProfile.address.state}` },
    { icon: "🏢", text: userProfile.businessName },
    { icon: "📱", text: userProfile.phone }
  ] : [];

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          basePrice: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity)
        }),
      });

      if (response.ok) {
        const updatedProductsRes = await fetch('http://localhost:8080/api/products');
        const updatedProducts = await updatedProductsRes.json();
        setProducts(updatedProducts.products);
        setIsCreateProductOpen(false);
        setNewProduct({ name: '', price: '', quantity: '', description: '', category: '', unit: 'kg' });
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.id]: e.target.value
    });
  };

  const renderProduct = (product) => (
    <div
      key={product._id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div>
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-600">
          Stock: {product.quantity} {product.unit} · ${product.basePrice}
        </p>
      </div>
      <span className={`px-2 py-1 rounded-full text-sm ${
        product.status === "available" 
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}>
        {product.status}
      </span>
    </div>
  );

  const renderOrder = (order) => (
    <div
      key={order._id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div>
        <h3 className="font-medium">Order #{order.orderNumber}</h3>
        <p className="text-sm text-gray-600">
          {order.from.businessName} · {order.products.length} items
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">${order.totalAmount.toLocaleString()}</p>
        <span className={`px-2 py-1 rounded-full text-sm ${
          order.status === "delivered"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}>
          {order.status}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Profile Section */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-3">
          <ProfileCard 
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV4_BFgtWaD_Ukdl05WEXC75kGym6RNDSLZw&s" 
            alt={userProfile?.name} 
          />
        </div>
        <div className="col-span-5">
          <InfoCard 
            title={userProfile?.name || 'Loading...'} 
            items={infoItems} 
          />
        </div>
        <div className="col-span-4">
          <StatsCard stats={stats} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-2 gap-6">
        <ListCard
          title="Products"
          icon={Package}
          action={
            <Button 
              variant="outline"
              onClick={() => setIsCreateProductOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2 inline" />
              Add Product
            </Button>
          }
          items={products}
          renderItem={renderProduct}
        />

        <ListCard
          title="Recent Orders"
          icon={ShoppingCart}
          items={orders}
          renderItem={renderOrder}
        />
      </div>

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        title="Create New Product"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="Product Name"
            id="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Category"
            id="category"
            value={newProduct.category}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            id="description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Price"
            id="price"
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Quantity"
            id="quantity"
            type="number"
            value={newProduct.quantity}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Unit"
            id="unit"
            value={newProduct.unit}
            onChange={handleInputChange}
            required
          />
          <Button
            type="submit"
            className="w-full"
          >
            Create Product
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default FarmerDashboard;