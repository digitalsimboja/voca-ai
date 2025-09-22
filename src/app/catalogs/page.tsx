"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductCatalog } from "@/types/catalog";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Edit,
  Copy,
  Eye,
  Trash2,
  ShoppingCart,
} from "lucide-react";

export default function CatalogsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [catalogs, setCatalogs] = useState<ProductCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      setLoading(true);
      // Get user-specific catalogs instead of all catalogs
      const result = await apiService.getCatalogsByUserId();
      if (result.status === 'success' && result.data) {
        setCatalogs(Array.isArray(result.data) ? result.data : [result.data]);
      }
    } catch (error) {
      console.error("Error loading catalogs:", error);
      toast.error("Failed to load catalogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCatalog = () => {
    router.push("/catalogs/create");
  };

  const handleEditCatalog = (catalogId: string) => {
    router.push(`/catalogs/edit/${catalogId}`);
  };

  const handleViewCatalog = (catalogId: string) => {
    const catalog = catalogs.find(c => c.id === catalogId);
    if (catalog && catalog.username) {
      router.push(`/${catalog.username}/catalog/${catalogId}`);
    } else {
      router.push(`/catalog/${catalogId}`);
    }
  };

  const handleCopyLink = async (shareableLink: string) => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDeleteCatalog = async (catalogId: string) => {
    if (confirm("Are you sure you want to delete this catalog?")) {
      try {
        const result = await apiService.deleteCatalog(catalogId);
        if (result.status === 'success') {
          toast.success("Catalog deleted successfully");
          loadCatalogs();
        } else {
          toast.error(result.message || "Failed to delete catalog");
        }
      } catch (error) {
        toast.error("Failed to delete catalog");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const getLowestPrice = (catalog: ProductCatalog) => {
    if (!catalog.pricingTiers || catalog.pricingTiers.length === 0) return 0;
    return Math.min(...catalog.pricingTiers.map(tier => tier.price));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-voca-cyan"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Catalogs</h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalogs and shareable order links
            </p>
          </div>
          <button
            onClick={handleCreateCatalog}
            className="inline-flex items-center px-4 py-2 bg-voca-cyan text-white rounded-md hover:bg-voca-dark transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Catalog
          </button>
        </div>

        {/* Catalogs Grid */}
        {catalogs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No catalogs yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first product catalog to start selling online
                </p>
                <button
                  onClick={handleCreateCatalog}
                  className="inline-flex items-center px-4 py-2 bg-voca-cyan text-white rounded-md hover:bg-voca-dark transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Catalog
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogs.map((catalog) => (
              <Card key={catalog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative" onClick={() => handleViewCatalog(catalog.id)}>
                    {catalog.mainImage ? (
                      <img
                        src={catalog.mainImage}
                        alt={catalog.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="bg-white/90 text-gray-700">
                        {catalog.pricingTiers?.length || 0} tiers
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {catalog.name || "Untitled Catalog"}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {catalog.description || "No description"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="font-semibold text-lg text-gray-900">
                          {formatPrice(getLowestPrice(catalog))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Agent ID</p>
                        <p className="text-xs font-mono text-gray-600">
                          {catalog.agentId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewCatalog(catalog.id)}
                          className="p-1.5 text-gray-600 hover:text-voca-cyan hover:bg-voca-light rounded-md transition-colors"
                          title="View catalog"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCatalog(catalog.id)}
                          className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-green-50 rounded-md transition-colors"
                          title="Edit catalog"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {catalog.shareableLink && (
                          <button
                            onClick={() => handleCopyLink(catalog.shareableLink)}
                            className="p-1.5 text-gray-600 hover:text-voca-cyan hover:bg-voca-light rounded-md transition-colors"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCatalog(catalog.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
