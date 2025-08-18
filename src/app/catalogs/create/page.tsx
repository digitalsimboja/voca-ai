"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import CreateRetailAgentModal from "@/components/modals/CreateRetailAgentModal";
import CreateStoreModal from "@/components/modals/CreateStoreModal";
import { ProductCatalog, PricingTier } from "@/types/catalog";
import { Agent } from "@/lib/agentStore";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Save,
  X,
  Copy,
  Link,
  ChevronDown,
  Store,
} from "lucide-react";



export default function CreateCatalogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<ProductCatalog>({
    id: "",
    name: "",
    description: "",
    mainImage: "",
    pricingTiers: [],
    agentId: "",
    shareableLink: "",
    userId: user?.userId || "",
    username: user?.username || "",
    isPublic: true,
  });
  const [userAgents, setUserAgents] = useState<Agent[]>([]);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [shareableLinkGenerated, setShareableLinkGenerated] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [userStore, setUserStore] = useState<{ store_name: string; id: string } | null>(null);



  // Fetch user's store on component mount
  useEffect(() => {
    const fetchUserStore = async () => {
      if (!user?.userId) {
        setIsLoadingStore(false);
        return;
      }
      
      setIsLoadingStore(true);
      try {
        const response = await apiService.getMyStore();
        
        if (response.status === 'success') {
          setUserStore(response.data as { store_name: string; id: string });
          // If user has a store, update the catalog username to store name
          if (response.data) {
            updateCatalog("username", (response.data as { store_name: string }).store_name);
          }
        }
      } catch (error) {
        console.error('Error fetching user store:', error);
        // Don't show error toast as it's expected for users without stores
      } finally {
        setIsLoadingStore(false);
      }
    };

    fetchUserStore();
  }, [user?.userId]);

  // Fetch user agents on component mount
  useEffect(() => {
    const fetchUserAgents = async () => {
      if (!user?.userId) {
        setIsLoadingAgents(false);
        return;
      }
      
      setIsLoadingAgents(true);
      try {
        const response = await apiService.getAgentsByUserId();
        
        if (response.status === 'success' && response.data) {
          const agents = Array.isArray(response.data) ? response.data : [response.data];
          setUserAgents(agents);
          
          // Set the first agent as default if available
          if (agents.length > 0 && !catalog.agentId) {
            updateCatalog("agentId", agents[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching user agents:', error);
        toast.error('Failed to load your agents');
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchUserAgents();
  }, [user?.userId]);

  // Update catalog userId when user changes
  useEffect(() => {
    if (user?.userId) {
      updateCatalog("userId", user.userId);
    }
  }, [user?.userId]);



  const updateCatalog = (field: keyof ProductCatalog, value: string | boolean) => {
    setCatalog((prev) => ({ ...prev, [field]: value }));
  };

  const handleStoreCreated = (storeData: { store_name: string; id: string }) => {
    setUserStore(storeData);
    updateCatalog("username", storeData.store_name);
    setShowStoreModal(false); // Close the modal
    toast.success("Store created successfully! You can now create catalogs for your store.");
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
    // Validate required fields
    if (!catalog.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    
    if (!catalog.agentId) {
      toast.error('Please select an agent');
      return;
    }



    if (!user?.userId) {
      toast.error('User not authenticated. Please log in to create catalogs.');
      return;
    }

    if (!linkGenerated) {
      // First time: Save the catalog
      try {
        const response = await apiService.createCatalog({
          name: catalog.name,
          description: catalog.description,
          mainImage: catalog.mainImage,
          pricingTiers: catalog.pricingTiers,
          agentId: catalog.agentId,
          shareableLink: '',
          userId: user.userId,
          username: catalog.username,
          isPublic: catalog.isPublic,
        });

        if (response.status === 'success' && response.data) {
          // Update catalog with the created data
          setCatalog(response.data as ProductCatalog);
          setLinkGenerated(true);
          toast.success(`Catalog saved successfully! Now you can generate a shareable link.`);
        } else {
          toast.error('Failed to save catalog. Please try again.');
        }
      } catch (err) {
        console.error('Error saving catalog:', err);
        toast.error('An error occurred while saving the catalog. Please try again.');
      }
    } else {
      // Second time: Generate shareable link
      try {
        const shareableLink = `${window.location.origin}/${catalog.username}/catalog/${catalog.id}`;
        
        const response = await apiService.updateCatalog(catalog.id, {
          shareableLink: shareableLink
        });

        if (response.status === 'success' && response.data) {
          // Update catalog with the generated link
          setCatalog(response.data as ProductCatalog);
          setShareableLinkGenerated(true);
          toast.success(`Shareable link generated successfully!`);
        } else {
          toast.error('Failed to generate link. Please try again.');
        }
      } catch (err) {
        console.error('Error generating link:', err);
        toast.error('An error occurred while generating the link. Please try again.');
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(catalog.shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link to clipboard");
    }
  };

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
                Create Product Catalog
              </h1>
              <p className="text-gray-600 text-sm">
                Set up your product and generate a shareable order link
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!catalog.name.trim() || !catalog.agentId || !userStore}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
              linkGenerated
                ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{linkGenerated ? "Generate Link" : "Save Catalog"}</span>
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
                {isLoadingAgents ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-sm text-gray-500">Loading your agents...</div>
                  </div>
                ) : userAgents.length > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Agent
                      </label>
                      <div className="relative">
                        <select
                          value={catalog.agentId}
                          onChange={(e) => updateCatalog("agentId", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                        >
                          {userAgents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name} - {agent.role}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 pt-2">
                      You don&apos;t have any agents yet. Create your first agent to get started.
                    </div>
                    <button
                      onClick={() => setShowAgentModal(true)}
                      className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Create Your First Agent</span>
                    </button>
                  </div>
                )}
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

            {/* Store Information */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Store Information
                </h3>
                <p className="text-sm text-gray-600">
                  Your catalog will be available at your store URL
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {isLoadingStore ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-sm text-gray-500">Loading your store...</div>
                  </div>
                ) : userStore ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Store Found: {userStore.store_name}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        Your store URL: {typeof window !== 'undefined' ? `${window.location.origin}/${userStore.store_name}` : `/${userStore.store_name}`}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={userStore.store_name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        placeholder="Your store name"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          No Store Found
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        You need to create a store before you can create catalogs.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setShowStoreModal(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Create Your Store</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={catalog.isPublic}
                    onChange={(e) => updateCatalog("isPublic", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this catalog publicly accessible
                  </label>
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
                        onClick={() => router.push("/catalogs")}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Back to Catalogs
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
          onSubmit={async (agentData) => {
            if (!user?.userId) {
              toast.error('User not authenticated. Please log in to create agents.');
              return;
            }

            try {
              const response = await apiService.createAgent(agentData as unknown as Omit<Agent, "id" | "createdAt" | "updatedAt">);
              if (response.status === 'success' && response.data) {
                const newAgent = response.data as Agent;
                
                // Add the new agent to the user agents list
                setUserAgents(prev => [...prev, newAgent]);
                
                // Set the new agent as the selected agent
                updateCatalog("agentId", newAgent.id);
                
                toast.success('Agent created successfully!');
                setShowAgentModal(false);
              } else {
                toast.error('Failed to create agent');
              }
            } catch (error) {
              console.error('Error creating agent:', error);
              toast.error('An error occurred while creating the agent');
            }
          }}
        />

        {/* Store Creation Modal */}
        <CreateStoreModal
          isOpen={showStoreModal}
          onClose={() => setShowStoreModal(false)}
          onSubmit={handleStoreCreated}
        />
      </div>
    </MainLayout>
  );
}
