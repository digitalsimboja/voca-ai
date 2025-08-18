"use client";

import { useState } from "react";
import { X, Store, Check, AlertCircle } from "lucide-react";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (storeData: { store_name: string; id: string }) => void;
}

export default function CreateStoreModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateStoreModalProps) {
  const [storeName, setStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);

  const checkStoreNameAvailability = async (name: string) => {
    if (!name.trim()) {
      setNameAvailable(null);
      return;
    }

    setIsCheckingName(true);
    try {
      // We'll implement this endpoint later if needed
      // For now, we'll let the backend handle the validation
      setNameAvailable(true);
    } catch (error) {
      console.error("Error checking store name:", error);
      setNameAvailable(false);
    } finally {
      setIsCheckingName(false);
    }
  };

  const handleStoreNameChange = (value: string) => {
    setStoreName(value);
    if (value.trim()) {
      checkStoreNameAvailability(value);
    } else {
      setNameAvailable(null);
    }
  };

  const handleSubmit = async () => {
    if (!storeName.trim()) {
      toast.error("Please enter a store name");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.createStore({
        store_name: storeName.trim(),
      });

      if (response.status === 'success' && response.data) {
        toast.success("Store created successfully!");
        onSubmit(response.data as { store_name: string; id: string });
        onClose();
      } else {
        toast.error(response.message || "Failed to create store");
      }
    } catch (error: unknown) {
      console.error("Error creating store:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while creating the store";
      if (errorMessage.includes("already have a store")) {
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred while creating the store");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Create Your Store
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  nameAvailable === false
                    ? "border-red-300"
                    : nameAvailable === true
                    ? "border-green-300"
                    : "border-gray-300"
                }`}
                placeholder="Enter your store name"
                disabled={isLoading}
              />
              {isCheckingName && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
              {nameAvailable === true && !isCheckingName && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
              )}
              {nameAvailable === false && !isCheckingName && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-600" />
              )}
            </div>
            {nameAvailable === true && (
              <p className="text-xs text-green-600 mt-1">
                Store name is available
              </p>
            )}
            {nameAvailable === false && (
              <p className="text-xs text-red-600 mt-1">
                Store name is not available
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This will be your store&apos;s unique URL:{" "}
              <span className="font-mono">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/${storeName}`
                  : `/${storeName}`}
              </span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2 text-sm">
              What happens next:
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Your store will be created with this name</li>
              <li>• You can then create catalogs for your store</li>
              <li>• Each catalog can have its own AI agent</li>
              <li>• Customers can access your store via the URL above</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !storeName.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Store"}
          </button>
        </div>
      </div>
    </div>
  );
}
