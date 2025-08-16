"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import CreateRetailAgentModal from "@/components/modals/CreateRetailAgentModal";
import { ProductCatalog, PricingTier } from "@/types/catalog";
import { apiService } from "@/services/apiService";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Save,
  X,
  Copy,
  Link,
} from "lucide-react";

const initialPricingTiers: PricingTier[] = [
  {
    packs: 1,
    price: 17000,
    image: "",
    description: "Single pack - perfect for trying out",
  },
];

export default function CreateOrderPage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<ProductCatalog>({
    id: "",
    name: "",
    description: "",
    mainImage: "",
    pricingTiers: initialPricingTiers,
    agentId: "agent_retail_001",
    shareableLink: "",
  });
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [shareableLinkGenerated, setShareableLinkGenerated] = useState(false);

  const updateCatalog = (field: keyof ProductCatalog, value: string) => {
    setCatalog((prev) => ({ ...prev, [field]: value }));
  };

  const updatePricingTier = (
    tierIndex: number,
    field: string,
    value: string | number | boolean
  ) => {
    setCatalog((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier, index) =>
        index === tierIndex ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const addPricingTier = () => {
    if (catalog.pricingTiers.length < 3) {
      setCatalog((prev) => ({
        ...prev,
        pricingTiers: [
          ...prev.pricingTiers,
          { packs: 1, price: 0, image: "", description: "" },
        ],
      }));
    }
  };

  const removePricingTier = (tierIndex: number) => {
    if (catalog.pricingTiers.length > 1) {
      setCatalog((prev) => ({
        ...prev,
        pricingTiers: prev.pricingTiers.filter(
          (_, index) => index !== tierIndex
        ),
      }));
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "tier",
    tierIndex?: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "main") {
          updateCatalog("mainImage", e.target?.result as string);
        } else if (type === "tier" && tierIndex !== undefined) {
          updatePricingTier(tierIndex, "image", e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!linkGenerated) {
      // First time: Save the order
      try {
        const response = await apiService.createCatalog({
          name: catalog.name,
          description: catalog.description,
          mainImage: catalog.mainImage,
          pricingTiers: catalog.pricingTiers,
          agentId: catalog.agentId,
          shareableLink: ''
        });

        if (response.success && response.data) {
          // Update catalog with the created data
          setCatalog(response.data);
          setLinkGenerated(true);
          alert(`Order saved successfully! Now you can generate a shareable link.`);
        } else {
          alert('Failed to save order. Please try again.');
        }
      } catch (err) {
        console.error('Error saving catalog:', err);
        alert('An error occurred while saving the order. Please try again.');
      }
    } else {
      // Second time: Generate shareable link
      try {
        const shareableLink = `${window.location.origin}/order/${catalog.id}`;
        
        const response = await apiService.updateCatalog(catalog.id, {
          shareableLink: shareableLink
        });

        if (response.success && response.data) {
          // Update catalog with the generated link
          setCatalog(response.data);
          setShareableLinkGenerated(true);
          alert(`Shareable link generated successfully!`);
        } else {
          alert('Failed to generate link. Please try again.');
        }
      } catch (err) {
        console.error('Error generating link:', err);
        alert('An error occurred while generating the link. Please try again.');
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(catalog.shareableLink);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Create Product Catalog
              </h1>
              <p className="text-gray-600 text-sm">
                Set up your product and generate a shareable order link
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
              linkGenerated
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{linkGenerated ? "Generate Link" : "Save Order"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Product Details */}
          <div className="lg:col-span-3 space-y-4">
            {/* AI Agent Configuration */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Agent Configuration
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={catalog.agentId}
                    onChange={(e) => updateCatalog("agentId", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="agent_retail_001"
                  />
                  <button
                    onClick={() => setShowAgentModal(true)}
                    className="sm:px-3 sm:py-2 px-1 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Create Agent
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h3>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={catalog.name}
                    onChange={(e) => updateCatalog("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Premium Herbal Tea Pack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={catalog.description}
                    onChange={(e) =>
                      updateCatalog("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                          className="text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                        >
                          Click to upload image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Tiers */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pricing Tiers ({catalog.pricingTiers.length}/3)
                  </h3>
                  {catalog.pricingTiers.length < 3 && (
                    <button
                      onClick={addPricingTier}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Tier</span>
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {catalog.pricingTiers.map((tier, tierIndex) => (
                    <div
                      key={tierIndex}
                      className="border border-gray-200 rounded-lg p-3"
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                  onClick={() =>
                                    updatePricingTier(tierIndex, "image", "")
                                  }
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
                                  onChange={(e) =>
                                    handleImageUpload(e, "tier", tierIndex)
                                  }
                                  className="hidden"
                                  id={`tier-image-${tierIndex}`}
                                />
                                <label
                                  htmlFor={`tier-image-${tierIndex}`}
                                  className="text-xs text-gray-600 cursor-pointer hover:text-blue-600"
                                >
                                  Upload image
                                </label>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tier Details */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Packs
                              </label>
                              <input
                                type="text"
                                value={tier.packs || ""}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  if (value === "") {
                                    updatePricingTier(tierIndex, "packs", 0);
                                  } else {
                                    updatePricingTier(
                                      tierIndex,
                                      "packs",
                                      parseInt(value)
                                    );
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  if (value === "") {
                                    updatePricingTier(tierIndex, "price", 0);
                                  } else {
                                    updatePricingTier(
                                      tierIndex,
                                      "price",
                                      parseInt(value)
                                    );
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                              onChange={(e) =>
                                updatePricingTier(
                                  tierIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="e.g., Perfect for trying out"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={tier.freeDelivery || false}
                                onChange={(e) =>
                                  updatePricingTier(
                                    tierIndex,
                                    "freeDelivery",
                                    e.target.checked
                                  )
                                }
                                className="mr-2"
                              />
                              <span className="text-xs text-gray-700">
                                Free Delivery
                              </span>
                            </label>
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-600">
                                ₦{tier.price.toLocaleString()}
                              </div>
                              {tier.discount && (
                                <Badge
                                  variant="success"
                                  size="sm"
                                  className="text-xs"
                                >
                                  {tier.discount}
                                </Badge>
                              )}
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
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              </CardHeader>
              <CardContent className="pt-0">
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
                          <span className="text-sm font-medium">
                            {tier.packs} Pack{tier.packs > 1 ? "s" : ""}
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            ₦{tier.price.toLocaleString()}
                          </span>
                        </div>
                        {tier.discount && (
                          <Badge
                            variant="success"
                            size="sm"
                            className="text-xs mt-1"
                          >
                            {tier.discount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shareable Link Section */}
            {shareableLinkGenerated && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Link className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Shareable Link
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Your product catalog is now live! Share this link with
                      your customers.
                    </p>

                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={catalog.shareableLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="font-medium text-blue-900 mb-2 text-sm">
                        How it works:
                      </h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>
                          • Customers click your link and see your product
                        </li>
                        <li>
                          • They enter their contact information and select
                          packs
                        </li>
                        <li>
                          • Orders are automatically processed by your AI agent
                        </li>
                        <li>• You receive notifications for new orders</li>
                      </ul>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() =>
                          window.open(catalog.shareableLink, "_blank")
                        }
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Link className="w-3 h-3" />
                        <span>Preview Link</span>
                      </button>
                      <button
                        onClick={() => setLinkGenerated(false)}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Create Another
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Agent Modal */}
        <CreateRetailAgentModal
          isOpen={showAgentModal}
          onClose={() => setShowAgentModal(false)}
          onSubmit={(agentData) => {
            // Generate a unique agent ID based on the agent data
            const agentId = `agent_retail_${agentData.profile.name
              .toLowerCase()
              .replace(/\s+/g, "_")}_${Date.now()}`;
            updateCatalog("agentId", agentId);
            setShowAgentModal(false);

            // You can also store the agent data for later use
            console.log("Agent created:", agentData);
          }}
        />
      </div>
    </MainLayout>
  );
}
