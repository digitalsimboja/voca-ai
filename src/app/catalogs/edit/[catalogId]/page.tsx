"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { ProductCatalog } from "@/types/catalog";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Save, Plus, Trash2, Upload, X } from "lucide-react";

export default function EditCatalogPage() {
  const router = useRouter();
  const params = useParams();
  const catalogId = params.catalogId as string;
  const { user } = useAuth();
  
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load catalog data
  useEffect(() => {
    const loadCatalogData = async () => {
      if (!catalogId || !user?.userId) return;
      
      setIsLoading(true);
      try {
        const catalogResponse = await apiService.getCatalogById(catalogId);
        if (catalogResponse.status === 'success' && catalogResponse.data) {
          setCatalog(catalogResponse.data as ProductCatalog);
        } else {
          toast.error('Failed to load catalog');
          router.push('/catalogs');
          return;
        }
      } catch (error) {
        console.error('Error loading catalog data:', error);
        toast.error('Failed to load catalog data');
        router.push('/catalogs');
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalogData();
  }, [catalogId, user?.userId, router]);

  const updateCatalog = (field: keyof ProductCatalog, value: string | boolean) => {
    if (!catalog) return;
    setCatalog((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const updatePricingTier = (tierIndex: number, field: string, value: string | number | boolean) => {
    if (!catalog) return;
    setCatalog((prev) => prev ? ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier, index) =>
        index === tierIndex ? { ...tier, [field]: value } : tier
      ),
    }) : null);
  };

  const addPricingTier = () => {
    if (!catalog) return;
    if (catalog.pricingTiers.length < 3) {
      setCatalog((prev) => prev ? ({
        ...prev,
        pricingTiers: [
          ...prev.pricingTiers,
          { packs: 1, price: 0, image: "", description: "" },
        ],
      }) : null);
    }
  };

  const removePricingTier = (tierIndex: number) => {
    if (!catalog) return;
    if (catalog.pricingTiers.length > 1) {
      setCatalog((prev) => prev ? ({
        ...prev,
        pricingTiers: prev.pricingTiers.filter(
          (_, index) => index !== tierIndex
        ),
      }) : null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "main" | "tier", tierIndex?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB for base64 encoding)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error(`Image file is too large. Please choose an image smaller than 2MB.`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Please select a valid image file (JPEG, PNG, GIF, or WebP).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Additional validation for base64 length (roughly 4/3 of file size)
        const estimatedBase64Length = Math.ceil((file.size * 4) / 3);
        if (estimatedBase64Length > 1000000) { // 1MB base64 limit
          toast.error(`Image is too large when converted. Please choose a smaller image.`);
          return;
        }

        if (type === "main") {
          updateCatalog("mainImage", result);
          toast.success("Main image uploaded successfully!");
        } else if (type === "tier" && tierIndex !== undefined) {
          updatePricingTier(tierIndex, "image", result);
          toast.success("Tier image uploaded successfully!");
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to read image file. Please try again.");
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!catalog || !user?.userId) {
      toast.error('Catalog data or user not available');
      return;
    }

    if (!catalog.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiService.updateCatalog(catalog.id, {
        name: catalog.name,
        description: catalog.description,
        mainImage: catalog.mainImage,
        pricingTiers: catalog.pricingTiers,
        agentId: catalog.agentId,
        isPublic: catalog.isPublic,
      });

      if (response.status === 'success' && response.data) {
        setCatalog(response.data as ProductCatalog);
        toast.success('Catalog updated successfully!');
      } else {
        toast.error('Failed to update catalog. Please try again.');
      }
    } catch (err) {
      console.error('Error updating catalog:', err);
      toast.error('An error occurred while updating the catalog. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-lg text-gray-500">Loading catalog...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!catalog) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-lg text-gray-500">Catalog not found</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/catalogs")}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalogs</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Edit Product Catalog
              </h1>
              <p className="text-gray-600 text-sm">
                Update your product and catalog settings
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!catalog.name.trim() || isSaving}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={catalog.name}
                    onChange={(e) => updateCatalog("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="e.g., Premium Herbal Tea Pack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={catalog.description}
                    onChange={(e) => updateCatalog("description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Describe your product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {catalog.mainImage ? (
                      <div className="relative">
                        <img
                          src={catalog.mainImage}
                          alt={catalog.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => updateCatalog("mainImage", "")}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "main")}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="text-sm text-gray-600 cursor-pointer hover:text-purple-600"
                        >
                          Click to upload image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={catalog.isPublic}
                    onChange={(e) => updateCatalog("isPublic", e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this catalog publicly accessible
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Tiers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pricing Tiers ({catalog.pricingTiers.length}/3)
                  </h3>
                  {catalog.pricingTiers.length < 3 && (
                    <button
                      onClick={addPricingTier}
                      className="flex items-center space-x-1 bg-green-400 text-white px-3 py-1.5 rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Tier</span>
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {catalog.pricingTiers.map((tier, tierIndex) => (
                    <div
                      key={tierIndex}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Tier {tierIndex + 1}
                        </h4>
                        {catalog.pricingTiers.length > 1 && (
                          <button
                            onClick={() => removePricingTier(tierIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tier Image */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tier Image
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                            {tier.image ? (
                              <div className="relative">
                                <img
                                  src={tier.image}
                                  alt={`${tier.packs} packs`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => updatePricingTier(tierIndex, "image", "")}
                                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                                >
                                  <X className="w-2 h-2" />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, "tier", tierIndex)}
                                  className="hidden"
                                  id={`tier-image-${tierIndex}`}
                                />
                                <label
                                  htmlFor={`tier-image-${tierIndex}`}
                                  className="text-xs text-gray-600 cursor-pointer hover:text-purple-600"
                                >
                                  Upload image
                                </label>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tier Details */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Packs
                              </label>
                              <input
                                type="text"
                                value={tier.packs || ""}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, "");
                                  if (value === "") {
                                    updatePricingTier(tierIndex, "packs", 0);
                                  } else {
                                    updatePricingTier(tierIndex, "packs", parseInt(value));
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="1"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Price (₦)
                              </label>
                              <input
                                type="text"
                                value={tier.price || ""}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, "");
                                  if (value === "") {
                                    updatePricingTier(tierIndex, "price", 0);
                                  } else {
                                    updatePricingTier(tierIndex, "price", parseInt(value));
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={tier.description || ""}
                              onChange={(e) => updatePricingTier(tierIndex, "description", e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="e.g., Perfect for trying out"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={tier.freeDelivery || false}
                                onChange={(e) => updatePricingTier(tierIndex, "freeDelivery", e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-xs text-gray-700">
                                Free Delivery
                              </span>
                            </label>
                            <div className="text-right">
                              <div className="text-sm font-bold text-purple-600">
                                ₦{tier.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {catalog.mainImage && (
                    <img
                      src={catalog.mainImage}
                      alt={catalog.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {catalog.name || "Product Name"}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {catalog.description || "Product description..."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {catalog.pricingTiers.map((tier, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {tier.packs} Pack{tier.packs > 1 ? "s" : ""}
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            ₦{tier.price.toLocaleString()}
                          </span>
                        </div>
                        {tier.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {tier.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
