"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import CreateMicrofinanceAgentModal from "@/components/modals/CreateMicrofinanceAgentModal";
import CreateRetailAgentModal from "@/components/modals/CreateRetailAgentModal";
import KnowledgeBaseModal from "@/components/modals/KnowledgeBaseModal";
import DeleteAgentModal from "@/components/modals/DeleteAgentModal";
import AgentDetailsModal from "@/components/modals/AgentDetailsModal";
import {
  SettingsTabs,
  GeneralSettings,
  RoutingSettings,
  SecuritySettings,
  NotificationSettings,
  IntegrationSettings,
  AgentManagement,
} from "@/components/settings";
import { useBusinessType } from "@/hooks/useBusinessType";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/apiService";
import { Agent, Settings as SettingsType } from "@/lib/types";
import { toast } from "@/utils/toast";


// Generic type for different agent data types
type AgentData = unknown;

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { businessType: detectedBusinessType } = useBusinessType();
  const [activeTab, setActiveTab] = useState("general");

  // Handle URL parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (
        tabParam &&
        [
          "general",
          "routing",
          "security",
          "notifications",
          "integrations",
          "agents",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Handle tab changes and update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update URL without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.pushState({}, "", url.toString());
    }
  };



  const [settings, setSettings] = useState<SettingsType & { agents: Agent[] }>({
    organization: {
      name: "Voca AI Solutions",
      industry: "microfinance",
      timezone: "America/New_York",
      supportedLanguages: ["English", "Igbo", "Yoruba", "Hausa"],
      businessHours: {
        start: "09:00",
        end: "17:00",
        timezone: "America/New_York",
      },
    },
    autoResponse: {
      enabled: true,
      message:
        "Thank you for contacting us. An AI agent will assist you shortly.",
      delay: 30,
    },
    routingRules: [],
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
      auditLogging: true,
    },
    notifications: {
      sms: false,
      webhook: true,
      webhookUrl: "https://api.vocaai.com/webhook/notifications",
    },
    agents: [],
  });

  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showKnowledgeBaseModal, setShowKnowledgeBaseModal] = useState(false);
  const [selectedAgentForKB, setSelectedAgentForKB] = useState<Agent | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgentForDelete, setSelectedAgentForDelete] =
    useState<Agent | null>(null);
  const [selectedAgentForDetails, setSelectedAgentForDetails] =
    useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings + agents
  useEffect(() => {
    const loadData = async () => {
      try {
        const settingsResult = await apiService.getSettings();
        if (settingsResult.status === 'success' && settingsResult.data) {
          const newSettings = {
            ...settings,
            ...(settingsResult.data as Record<string, unknown>),
            agents: settings.agents,
          };
          setSettings(newSettings);
        }

        // Only get user-specific agents
        if (user?.userId) {
          const agentsResult = await apiService.getAgentsByUserId();
          console.log("Agents API response:", agentsResult);
          if (agentsResult.status === 'success' && agentsResult.data) {
            const agents = Array.isArray(agentsResult.data)
              ? agentsResult.data
              : [agentsResult.data];
            console.log("Processed agents:", agents);
            setSettings((prev) => ({
              ...prev,
              agents: agents.filter(
                (agent): agent is Agent => agent !== null
              ) as Agent[],
            }));
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [user?.userId]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && !isSaving) {
          handleSaveSettings();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, isSaving]);

  // --- handlers (unchanged) ---

  const handleCreateAgent = async (agentData: AgentData) => {
    if (!user?.userId) {
      toast.error('User not authenticated. Please log in to create agents.');
      return;
    }

    try {
      const result = await apiService.createAgent(
        agentData as unknown as Omit<Agent, "id" | "createdAt" | "updatedAt">
      );

      if (result.status === 'success' && result.data) {
        // Show success message
        toast.success("Agent created successfully!");

        // Add a small delay to ensure the store is updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        const agentsResult = await apiService.getAgentsByUserId();

        if (agentsResult.status === 'success' && agentsResult.data) {
          const agents = Array.isArray(agentsResult.data)
            ? agentsResult.data
            : [agentsResult.data];

          setSettings((prev) => {
            const newSettings = {
              ...prev,
              agents: agents.filter(
                (agent): agent is Agent => agent !== null
              ) as Agent[],
            };
            console.log("New settings:", newSettings);
            return newSettings;
          });
        }

        // Close modal
        setShowCreateAgent(false);

        // Navigate to settings agents tab
        setTimeout(() => {
          router.push("/settings?tab=agents");
        }, 1000);
      } else {
        toast.error(result.message || "Failed to create agent");
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Failed to create agent. Please try again.");
    }
  };

  const handleDeleteAgent = (agentId: string) => {
    const agent = settings.agents?.find((a) => a.id === agentId);
    if (agent) {
      setSelectedAgentForDelete(agent);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAgentForDelete) return;
    setIsDeleting(true);
    try {
      const result = await apiService.deleteAgent(selectedAgentForDelete.id);
      if (result.status === 'success') {
        // Update the local agents state immediately
        setSettings((prev) => ({
          ...prev,
          agents:
            prev.agents?.filter(
              (agent) => agent.id !== selectedAgentForDelete.id
            ) || [],
        }));
        
        toast.success(
          `Agent "${selectedAgentForDelete.name}" deleted successfully`
        );
        setShowDeleteModal(false);
        setSelectedAgentForDelete(null);
      } else {
        toast.error(result.message || "Failed to delete agent");
      }
    } catch (error) {
      toast.error("Failed to delete agent. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowAgentDetails = (agent: Agent) => {
    setSelectedAgentForDetails(agent);
    setShowDetailsModal(true);
  };

  const handleConnectKnowledgeBase = (agentId: string) => {
    const agent = settings.agents?.find((a) => a.id === agentId);
    if (agent) {
      setSelectedAgentForKB(agent);
      setShowKnowledgeBaseModal(true);
    }
  };

  const handleKnowledgeBaseSubmit = (
    knowledgeBaseData: Record<string, unknown>
  ) => {
    const newAgents = settings.agents?.map((agent) =>
      agent.id === selectedAgentForKB?.id
        ? ({
            ...agent,
            knowledgeBase: true,
            knowledgeBaseData,
          } as Agent)
        : agent
    );
    setSettings({
      ...settings,
      agents: newAgents as Agent[],
    });
    setShowKnowledgeBaseModal(false);
    setSelectedAgentForKB(null);
  };

  const handleSaveSettings = async () => {
    if (!user?.userId) {
      toast.error('User not authenticated. Please log in to save settings.');
      return;
    }

    setIsSaving(true);
    try {
      // Remove agents from settings data as it's handled separately
      const { agents, ...settingsData } = settings;
      
      const result = await apiService.updateSettings(settingsData);
      
      if (result.status === 'success') {
        setHasUnsavedChanges(false);
        toast.success('Settings saved successfully!');
      } else {
        toast.error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsChange = (newSettings: SettingsType & { agents: Agent[] }) => {
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  // update settings (unchanged)...

  return (
    <MainLayout>
      <div className="space-y-4 px-2 sm:px-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-gray-600 text-sm">
              Configure your AI Contact Center
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600 font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={isSaving || !hasUnsavedChanges}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                isSaving || !hasUnsavedChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modals (unchanged) */}
        <CreateMicrofinanceAgentModal
          isOpen={
            showCreateAgent &&
            (detectedBusinessType === "microfinance" ||
              detectedBusinessType === "banking")
          }
          onClose={() => setShowCreateAgent(false)}
          onSubmit={handleCreateAgent}
        />
        <CreateRetailAgentModal
          isOpen={
            showCreateAgent &&
            (detectedBusinessType === "retail" ||
              detectedBusinessType === "ecommerce" ||
              detectedBusinessType === "social_media")
          }
          onClose={() => setShowCreateAgent(false)}
          onSubmit={handleCreateAgent}
        />
        <KnowledgeBaseModal
          isOpen={showKnowledgeBaseModal}
          onClose={() => {
            setShowKnowledgeBaseModal(false);
            setSelectedAgentForKB(null);
          }}
          onSubmit={handleKnowledgeBaseSubmit}
          agentName={selectedAgentForKB?.name || ""}
          currentKnowledgeBase={
            selectedAgentForKB?.knowledgeBaseData || undefined
          }
        />
        <DeleteAgentModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAgentForDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          agent={selectedAgentForDelete}
          isLoading={isDeleting}
        />
        <AgentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAgentForDetails(null);
          }}
          agent={selectedAgentForDetails}
          onAgentUpdate={(updatedAgent) => {
            // Update the agent in the settings
            const updatedAgents = settings.agents?.map((a) =>
              a.id === updatedAgent.id ? updatedAgent : a
            ) || [];
            setSettings({
              ...settings,
              agents: updatedAgents,
            });
            setShowDetailsModal(false);
            setSelectedAgentForDetails(null);
          }}
          onAgentDelete={(agentId) => {
            // Trigger the delete flow
            const agent = settings.agents?.find((a) => a.id === agentId);
            if (agent) {
              setSelectedAgentForDelete(agent);
              setShowDeleteModal(true);
            }
          }}
        />

        {/* Tabs - add horizontal scroll on small screens */}
        <div className="overflow-x-auto">
          <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Tab Content */}
        <div className="pb-6">
          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
          {activeTab === "routing" && (
            <RoutingSettings
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
          {activeTab === "security" && (
            <SecuritySettings
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationSettings
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
          {activeTab === "integrations" && <IntegrationSettings />}
          {activeTab === "agents" && (
            <AgentManagement
              agents={settings.agents || []}
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onShowCreateAgent={() => setShowCreateAgent(true)}
              onDeleteAgent={handleDeleteAgent}
              onShowAgentDetails={handleShowAgentDetails}
              onConnectKnowledgeBase={handleConnectKnowledgeBase}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
