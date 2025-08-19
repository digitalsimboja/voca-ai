"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ProductCatalog, PricingTier } from "@/types/catalog";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";
import {
  ShoppingCart,
  Package,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Check,
} from "lucide-react";

interface OrderForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  selectedTier: PricingTier | null;
  quantity: number;
  deliveryAddress: string;
  specialInstructions: string;
}

export default function PublicCatalogPage() {
  const params = useParams();
  const catalogId = params.id as string;
  
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    selectedTier: null,
    quantity: 1,
    deliveryAddress: "",
    specialInstructions: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, [catalogId]);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCatalogById(catalogId);
      if (result.status === 'success' && result.data) {
        setCatalog(result.data as ProductCatalog);
        // Set the first tier as default selection
        if ((result.data as ProductCatalog).pricingTiers && (result.data as ProductCatalog).pricingTiers.length > 0) {
          const catalogData = result.data as ProductCatalog;
          setOrderForm(prev => ({
            ...prev,
            selectedTier: catalogData.pricingTiers[0]
          }));
        }
      } else {
        toast.error("Catalog not found");
      }
    } catch (error) {
      console.error("Error loading catalog:", error);
      toast.error("Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelection = (tier: PricingTier) => {
    setOrderForm(prev => ({
      ...prev,
      selectedTier: tier,
      quantity: 1
    }));
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity >= 1) {
      setOrderForm(prev => ({ ...prev, quantity }));
    }
  };

  const handleInputChange = (field: keyof OrderForm, value: string | number) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!catalog || !orderForm.selectedTier) {
      toast.error("Please select a pricing tier");
      return;
    }

    if (!orderForm.customerName || !orderForm.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // Transform data to match backend expectations
      const orderData = {
        customer_name: orderForm.customerName,
        customer_email: orderForm.customerEmail || undefined,
        customer_phone: orderForm.customerPhone,
        delivery_address: orderForm.deliveryAddress,
        items: [{
          name: `${orderForm.selectedTier.packs} Pack${orderForm.selectedTier.packs > 1 ? 's' : ''} - ${catalog.name}`,
          quantity: orderForm.quantity,
          price: orderForm.selectedTier.price,
          image: orderForm.selectedTier.image
        }],
        total_amount: orderForm.selectedTier.price * orderForm.quantity,
        store_id: catalog.storeId,
        catalog_id: catalog.id,
        agent_id: catalog.agentId,

        notes: orderForm.specialInstructions || `Selected tier: ${orderForm.selectedTier.packs} pack${orderForm.selectedTier.packs > 1 ? 's' : ''}`
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.status === 'success') {
        toast.success("Order submitted successfully! You'll receive a confirmation shortly.");
        
        // Reset form
        setOrderForm({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          selectedTier: orderForm.selectedTier,
          quantity: 1,
          deliveryAddress: "",
          specialInstructions: "",
        });
      } else {
        toast.error(response.message || "Failed to submit order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const calculateTotal = () => {
    if (!orderForm.selectedTier) return 0;
    return orderForm.selectedTier.price * orderForm.quantity;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Catalog Not Found</h1>
          <p className="text-gray-600">The catalog you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {catalog.name || "Product Catalog"}
                </h1>
                <p className="text-sm text-gray-600">Powered by Voca AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {catalog.mainImage ? (
                <img
                  src={catalog.mainImage}
                  alt={catalog.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Details & Order Form */}
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {catalog.name || "Product Name"}
              </h1>
              <p className="text-gray-600 mb-4">
                {catalog.description || "Product description..."}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8 • 127 reviews)</span>
              </div>

              {/* Pricing Tiers */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Select Your Package</h3>
                {catalog.pricingTiers?.map((tier, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      orderForm.selectedTier === tier
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTierSelection(tier)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          orderForm.selectedTier === tier
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}>
                          {orderForm.selectedTier === tier && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {tier.packs} Pack{tier.packs > 1 ? "s" : ""}
                          </h4>
                          <p className="text-sm text-gray-600">{tier.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(tier.price)}
                        </div>
                        {tier.freeDelivery && (
                          <Badge variant="success" size="sm" className="text-xs">
                            Free Delivery
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Order</h3>
              
              <div className="space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(orderForm.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{orderForm.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(orderForm.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={orderForm.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={orderForm.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={orderForm.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={orderForm.deliveryAddress}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your delivery address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={orderForm.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special instructions for your order"
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {orderForm.selectedTier?.packs} Pack{orderForm.selectedTier?.packs && orderForm.selectedTier.packs > 1 ? "s" : ""} × {orderForm.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(calculateTotal())}</span>
                    </div>
                    {orderForm.selectedTier?.freeDelivery && (
                      <div className="flex justify-between text-green-600">
                        <span>Free Delivery</span>
                        <span>₦0</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting || !orderForm.selectedTier}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Place Order</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
