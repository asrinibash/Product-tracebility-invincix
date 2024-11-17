import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Factory, Truck, Store } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import {server} from "../main"



// Image mapping object
const productImages = {
  "TOM-001": [
    "https://www.delmonte.com/sites/default/files/products//2023-12/DM%20Tomato%20Sauce%208oz%20200x200.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm4FZoZpr2nQA2KhVm801_b1w8kZCEX366GzBh4dMQD-S6DBIy3lhrX3QBxyBlIsPwKd4&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuubmgzdSJwfSzO4Ca2JG21vc4xZNA2JT3ng&s",
  ],
  default: [
    "https://www.delmonte.com/sites/default/files/9e032bb31ec35e6436d5057ad4e27126214d854a.jpg",
    "https://www.delmonte.com/sites/default/files/9e032bb31ec35e6436d5057ad4e27126214d854a.jpg",
    "https://www.delmonte.com/sites/default/files/9e032bb31ec35e6436d5057ad4e27126214d854a.jpg",
  ],
};
const BASE_URL = "https://product-tracebility-invincix-1.onrender.com";
const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [qrLoadErrors, setQrLoadErrors] = useState({});
  const [qrLoading, setQrLoading] = useState({});

  const handleQrError = (productId) => {
    setQrLoadErrors((prev) => ({
      ...prev,
      [productId]: true,
    }));
    setQrLoading((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  const handleQrLoadStart = (productId) => {
    setQrLoading((prev) => ({
      ...prev,
      [productId]: true,
    }));
    setQrLoadErrors((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  const handleQrLoadSuccess = (productId) => {
    setQrLoading((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${server}/api/products/user/retailer/RETAIL-001`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);

        // Initialize image indices after products are loaded
        const initialImageIndices = {};
        data.forEach((product) => {
          initialImageIndices[product.productId] = 0;
        });
        setCurrentImageIndex(initialImageIndices);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const getProductImages = (productId) => {
    return productImages[productId] || productImages.default;
  };

  const handleNextImage = (productId, e) => {
    e.stopPropagation();
    const images = getProductImages(productId);
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % images.length,
    }));
  };

  const handlePrevImage = (productId, e) => {
    e.stopPropagation();
    const images = getProductImages(productId);
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]:
        prev[productId] === 0 ? images.length - 1 : prev[productId] - 1,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Del Monte Premium Products - Consumer Page
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const images = getProductImages(product.productId);
          const currentIndex = currentImageIndex[product.productId] || 0;

          return (
            <Card className="hover:shadow-lg transition-shadow w-full max-w-sm">
              <CardHeader className="space-y-0 pb-4">
                <div className="relative">
                  <img
                    src={images[currentIndex]}
                    alt={product.aftername}
                    className="rounded-t-lg h-48 w-full object-cover"
                  />
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/80 hover:bg-white/90 rounded-full p-2"
                      onClick={(e) => handlePrevImage(product.productId, e)}
                    >
                      ←
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/80 hover:bg-white/90 rounded-full p-2"
                      onClick={(e) => handleNextImage(product.productId, e)}
                    >
                      →
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {`${currentIndex + 1}/${images.length}`}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <CardTitle className="text-xl">{product.aftername}</CardTitle>
                  <div className="w-24 h-24">
                    <QRCodeCanvas
                      value={`${BASE_URL}${product.productId}`}
                      size={96} // 24px * 4 to match the container size
                      level={"H"} // High error correction level
                      includeMargin={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Brand:</span> Del Monte
                  </p>
                  {product.farmer.cropDetails.organic && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Organic
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Variety:</span>{" "}
                  {product.farmer.cropDetails.variety}
                </p>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  onClick={() => handleViewDetails(product)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedProduct && (
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-white pb-4 z-10">
              <DialogTitle className="text-2xl font-bold">
                Product Details: {selectedProduct.productName}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 pb-4">
              {/* Farmer Details */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Farmer Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <p>
                    <span className="font-semibold">Farm:</span>{" "}
                    {selectedProduct.farmer.name}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedProduct.farmer.farmLocation}
                  </p>
                  <p>
                    <span className="font-semibold">Harvest Date:</span>{" "}
                    {formatDate(selectedProduct.farmer.harvestDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Organic:</span>{" "}
                    {selectedProduct.farmer.cropDetails.organic ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">
                    Manufacturing Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <p>
                    <span className="font-semibold">Manufacturer:</span>{" "}
                    {selectedProduct.manufacturer.name}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedProduct.manufacturer.location}
                  </p>
                  <p>
                    <span className="font-semibold">Production Date:</span>{" "}
                    {formatDate(selectedProduct.manufacturer.productionDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Batch Number:</span>{" "}
                    {selectedProduct.manufacturer.batchNumber}
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Ingredients:</p>
                    <ul className="list-disc pl-5">
                      {selectedProduct.manufacturer.ingredients.map(
                        (ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Distribution Details */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">
                    Distribution Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <p>
                    <span className="font-semibold">Distributor:</span>{" "}
                    {selectedProduct.distributor.name}
                  </p>
                  <p>
                    <span className="font-semibold">Warehouse:</span>{" "}
                    {selectedProduct.distributor.warehouseLocation}
                  </p>
                  <p>
                    <span className="font-semibold">Shipment Date:</span>{" "}
                    {formatDate(selectedProduct.distributor.shipmentDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Delivery Date:</span>{" "}
                    {formatDate(selectedProduct.distributor.deliveryDate)}
                  </p>
                </div>
              </div>

              {/* Retail Details */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Retail Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <p>
                    <span className="font-semibold">Retailer:</span>{" "}
                    {selectedProduct.retailer.name}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedProduct.retailer.storeLocation}
                  </p>
                  <p>
                    <span className="font-semibold">Shelf Date:</span>{" "}
                    {formatDate(selectedProduct.retailer.shelfDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Current Stock:</span>{" "}
                    {selectedProduct.retailer.stock} units
                  </p>
                </div>
              </div>

              {/* Traceability History */}
              {selectedProduct.traceabilityHistory && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Traceability History
                  </h3>
                  <div className="space-y-2">
                    {selectedProduct.traceabilityHistory.map((event, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-200 pl-4 py-2"
                      >
                        <p className="font-semibold">{event.stage}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(event.timestamp)}
                        </p>
                        <p className="text-sm">{event.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Rest of the dialog content remains the same */}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ProductListing;
