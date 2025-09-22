"use client";

import { useState, useEffect } from "react";
import { X, Store, Check, AlertCircle, User, Plus } from "lucide-react";
import { apiService } from "@/services/apiService";
import { toast } from "@/utils/toast";
import { Agent } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (storeData: { store_name: string; id: string }) => void;
  userAgents?: Agent[];
  selectedAgentId?: string;
}

export default function CreateStoreModal({
  isOpen,
  onClose,
  onSubmit,
  userAgents = [],
  selectedAgentId,
}: CreateStoreModalProps) {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>(selectedAgentId || "");
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>(userAgents);

  // Fetch user agents if not provided
  useEffect(() => {
    if (userAgents.length === 0 && user?.userId) {
      fetchUserAgents();
    } else {
      setAvailableAgents(userAgents);
    }
  }, [userAgents, user?.userId]);

  // Update selected agent when prop changes
  useEffect(() => {
    if (selectedAgentId) {
      setSelectedAgent(selectedAgentId);
    }
  }, [selectedAgentId]);

  const fetchUserAgents = async () => {
    if (!user?.userId) return;
    
    setIsLoadingAgents(true);
    try {
      const response = await apiService.getAgentsByUserId();
      
      if (response.status === 'success' && response.data) {
        const agents = Array.isArray(response.data) ? response.data : [response.data];
        setAvailableAgents(agents);
        
        // Set the first agent as default if available and no agent is selected
        if (agents.length > 0 && !selectedAgent) {
          setSelectedAgent(agents[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching user agents:', error);
      toast.error('Failed to load your agents');
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const checkStoreNameAvailability = async (name: string) => {
    
    if (!name.trim()) {
      setNameAvailable(null);
      return;
    }

    // Basic validation
    const nameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!nameRegex.test(name)) {
      setNameAvailable(false);
      return;
    }

    setIsCheckingName(true);
    try {
      const response = await apiService.checkStoreNameAvailability(name);
      
      if (response.status === 'success' && response.data) {
        const data = response.data as { available: boolean; message: string };
        setNameAvailable(data.available);
        
        if (!data.available) {
          toast.error(data.message || 'Store name is not available');
        }
      } else {
        setNameAvailable(false);
        toast.error(response.message || 'Failed to check store name availability');
      }
    } catch (error) {
      console.error("Error checking store name:", error);
      setNameAvailable(false);
      toast.error('Failed to check store name availability');
    } finally {
      setIsCheckingName(false);
    }
  };

  const handleStoreNameChange = (value: string) => {
    // Remove spaces and replace with underscores
    const sanitizedValue = value.replace(/\s+/g, '_');
    
    // Only allow letters, numbers, underscores, and hyphens
    const filteredValue = sanitizedValue.replace(/[^a-zA-Z0-9_-]/g, '');

    setStoreName(filteredValue);
    
    if (filteredValue.trim()) {
      // Debounce the API call
      const timeoutId = setTimeout(() => {
        checkStoreNameAvailability(filteredValue);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setNameAvailable(null);
    }
  };

  const handleSubmit = async () => {
    if (!storeName.trim()) {
      toast.error("Please enter a store name");
      return;
    }

    // Additional validation for store name format
    if (storeName.length < 3) {
      toast.error("Store name must be at least 3 characters long");
      return;
    }

    if (storeName.length > 30) {
      toast.error("Store name must be no more than 30 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(storeName)) {
      toast.error("Store name can only contain letters, numbers, underscores (_), and hyphens (-)");
      return;
    }

    if (nameAvailable === false) {
      toast.error("Please choose a different store name");
      return;
    }

    if (nameAvailable === null) {
      toast.error("Please wait for store name validation");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.createStore({
        store_name: storeName.trim(),
      });

      if (response.status === 'success' && response.data) {
        const storeData = response.data as { store_name: string; id: string };
        
        // Associate agent with store if an agent is selected
        if (selectedAgent && storeData.id) {
          try {
            const associateResponse = await apiService.associateAgentWithStore(selectedAgent, storeData.id);
            if (associateResponse.status === 'success') {
              toast.success("Store created and agent associated successfully!");
            } else {
              toast.warning("Store created but failed to associate agent. You can do this later.");
            }
          } catch (associateError) {
            console.error("Error associating agent with store:", associateError);
            toast.warning("Store created but failed to associate agent. You can do this later.");
          }
        } else {
          toast.success("Store created successfully!");
        }
        
        onSubmit(storeData);
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-voca-cyan" />
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
          {/* Store Name Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-voca-cyan focus:border-transparent text-sm ${
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-voca-cyan"></div>
                </div>
              )}
              {nameAvailable === true && !isCheckingName && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              )}
              {nameAvailable === false && !isCheckingName && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-600" />
              )}
            </div>
            {nameAvailable === true && (
              <p className="text-xs text-green-400 mt-1">
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
            <p className="text-xs text-gray-500 mt-1">
              Store name must be 3-30 characters. Only letters, numbers, underscores (_), and hyphens (-) are allowed. Spaces will be automatically converted to underscores.
            </p>
          </div>

          {/* Agent Association Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Associate AI Agent (Optional)
            </label>
            {isLoadingAgents ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">Loading your agents...</div>
              </div>
            ) : availableAgents.length > 0 ? (
              <div className="space-y-2">
                <div className="relative">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-voca-cyan focus:border-transparent text-sm appearance-none bg-white"
                    disabled={isLoading}
                  >
                    <option value="">Select an agent (optional)</option>
                    {availableAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} - {agent.role}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedAgent && (
                          <div className="bg-voca-light border border-voca-light rounded-lg p-2">
          <p className="text-xs text-voca-dark">
                      Agent &quot;{availableAgents.find(a => a.id === selectedAgent)?.name}&quot; will be associated with your store
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    No Agents Found
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  You can create an agent later and associate it with your store.
                </p>
              </div>
            )}
          </div>

                  <div className="bg-voca-light border border-voca-light rounded-lg p-3">
          <h4 className="font-medium text-voca-dark mb-2 text-sm">
              What happens next:
            </h4>
            <ul className="text-xs text-voca-dark space-y-1">
              <li>• Your store will be created with this name</li>
              {selectedAgent && <li>• Your selected AI agent will be associated with the store</li>}
              <li>• You can then create catalogs for your store</li>
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
            disabled={isLoading || !storeName.trim() || nameAvailable === false}
            className="flex-1 px-4 py-2 bg-voca-cyan text-white rounded-lg hover:bg-voca-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Store"}
          </button>
        </div>
      </div>
    </div>
  );
}
