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

  React.useEffect(() => {
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

  // Load settings + agents
  useEffect(() => {
    const loadData = async () => {
      try {
        const settingsResult = await apiService.getSettings();
        if (settingsResult.status === 'success' && settingsResult.data) {
          setSettings((prev) => ({
            ...prev,
            ...(settingsResult.data as Record<string, unknown>),
            agents: prev.agents,
          }));
        }

        // Only get user-specific agents
        if (user?.userId) {
          const agentsResult = await apiService.getAgentsByUserId();
          if (agentsResult.status === 'success' && agentsResult.data) {
            const agents = Array.isArray(agentsResult.data)
              ? agentsResult.data
              : [agentsResult.data];
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

  // --- handlers (unchanged) ---

  const handleCreateAgent = async (agentData: AgentData) => {
    if (!user?.userId) {
      toast.error('User not authenticated. Please log in to create agents.');
      return;
    }

    try {
      console.log("Creating agent with data:", agentData);

      const result = await apiService.createAgent(
        agentData as unknown as Omit<Agent, "id" | "createdAt" | "updatedAt">
      );

      console.log("Create agent result:", result);

      if (result.status === 'success' && result.data) {
        // Show success message
        toast.success("Agent created successfully!");

        // Add a small delay to ensure the store is updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        const agentsResult = await apiService.getAgentsByUserId();
        console.log("Get user agents result:", agentsResult);

        if (agentsResult.status === 'success' && agentsResult.data) {
          const agents = Array.isArray(agentsResult.data)
            ? agentsResult.data
            : [agentsResult.data];

          console.log("Setting agents:", agents);

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
        />

        {/* Tabs - add horizontal scroll on small screens */}
        <div className="overflow-x-auto">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="pb-6">
          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              onSettingsChange={setSettings}
            />
          )}
          {activeTab === "routing" && (
            <RoutingSettings
              settings={settings}
              onSettingsChange={setSettings}
            />
          )}
          {activeTab === "security" && (
            <SecuritySettings
              settings={settings}
              onSettingsChange={setSettings}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationSettings
              settings={settings}
              onSettingsChange={setSettings}
            />
          )}
          {activeTab === "integrations" && <IntegrationSettings />}
          {activeTab === "agents" && (
            <AgentManagement
              agents={settings.agents || []}
              settings={settings}
              onSettingsChange={setSettings}
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
