import React, { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { User, Trash2, AlertCircle, Eye } from "lucide-react";
import { Agent, Settings as SettingsType } from "@/lib/types";
import { useExistingAgent } from "@/hooks/useExistingAgent";

interface AgentManagementProps {
  agents: Agent[];
  settings: SettingsType & { agents: Agent[] };
  onSettingsChange: (settings: SettingsType & { agents: Agent[] }) => void;
  onShowCreateAgent: () => void;
  onDeleteAgent: (agentId: string) => void;
  onShowAgentDetails: (agent: Agent) => void;
  onConnectKnowledgeBase: (agentId: string) => void;
}

export default function AgentManagement({
  agents,
  settings,
  onSettingsChange,
  onShowCreateAgent,
  onDeleteAgent,
  onShowAgentDetails,
  onConnectKnowledgeBase,
}: AgentManagementProps) {
  const { existingAgent, hasExistingAgent, isLoading, refetch } = useExistingAgent();

  // Refetch existing agent status when agents array changes
  useEffect(() => {
    refetch();
  }, [agents.length, refetch]);

  // Determine if we should show the "no agents" state based on both the hook and local agents array
  const shouldShowNoAgents = (!agents || agents.length === 0) && !hasExistingAgent;
  const shouldShowExistingAgent = (!agents || agents.length === 0) && hasExistingAgent && existingAgent;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Agent Management
            </h3>
            {hasExistingAgent || (agents && agents.length > 0) ? (
              <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  You already have an agent
                </span>
              </div>
            ) : (
              <button
                onClick={onShowCreateAgent}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-green-400 text-white px-3 py-2 rounded-md hover:bg-green-500 transition-colors text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                <span>{isLoading ? 'Checking...' : 'Create Agent'}</span>
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-1.5">
          <div className="space-y-3">
            {agents?.map((agent) => (
              <div
                key={agent.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-voca-cyan transition-all cursor-pointer group"
                onClick={() => onShowAgentDetails(agent)}
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-voca-light rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-voca-cyan" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-gray-900">
                        {agent.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {agent.role} • {agent.businessType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        agent.status === "active"
                          ? "bg-green-100 text-green-500"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {agent.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agent.status === "active"}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newAgents = agents?.map((a) =>
                            a.id === agent.id
                              ? {
                                  ...a,
                                  status: e.target.checked ? "active" : "inactive",
                                } as Agent
                              : a
                          );
                          onSettingsChange({
                            ...settings,
                            agents: newAgents || [],
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowAgentDetails(agent);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View agent details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAgent(agent.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete agent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600 font-medium text-xs mb-0.5">
                      Channels:
                    </p>
                    <p className="text-gray-700 text-xs leading-tight break-words">
                      {agent.channels?.join(", ") || "No channels configured"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium text-xs mb-0.5">
                      Languages:
                    </p>
                    <p className="text-gray-700 text-xs leading-tight break-words">
                      {agent.languages?.join(", ") || "No languages configured"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium text-xs mb-0.5">
                      Created:
                    </p>
                    <p className="text-gray-700 text-xs leading-tight">
                      {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium text-xs mb-0.5">
                      Knowledge Base:
                    </p>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-xs ${
                          agent.knowledgeBase ? "text-green-400" : "text-red-600"
                        }`}
                      >
                        {agent.knowledgeBase ? "Connected" : "Not Connected"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onConnectKnowledgeBase(agent.id);
                        }}
                        className="text-voca-cyan hover:text-voca-dark text-xs font-medium"
                      >
                        {agent.knowledgeBase ? "Manage" : "Connect"}
                      </button>
                    </div>
                    {agent.knowledgeBase && agent.knowledgeBaseData && (
                      <p className="text-xs text-gray-500 leading-tight">
                        {agent.knowledgeBaseData.fileCount || 0} files,{" "}
                        {agent.knowledgeBaseData.sourceCount || 0} sources
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State or Existing Agent Info */}
            {shouldShowNoAgents || shouldShowExistingAgent ? (
              <div className="text-center py-8 sm:py-12">
                {shouldShowExistingAgent ? (
                  // Show existing agent information
                  <div className="max-w-md mx-auto">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      You Already Have an Agent
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                      <h4 className="font-medium text-yellow-900 mb-2">
                        {existingAgent?.name}
                      </h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        {existingAgent?.role} • {existingAgent?.businessType}
                      </p>
                      <p className="text-xs text-yellow-700">
                        Created: {existingAgent?.createdAt ? new Date(existingAgent.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                      You can enhance your agent's capabilities by updating its knowledge base and settings.
                    </p>
                    <button
                      onClick={() => existingAgent && onShowAgentDetails(existingAgent)}
                      className="bg-voca-cyan text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg hover:bg-voca-dark transition-colors text-sm font-medium shadow-sm hover:shadow-md flex items-center mx-auto"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Manage My Agent
                    </button>
                    <div className="mt-6 p-3 sm:p-4 bg-voca-light rounded-lg border border-voca-light text-left">
                      <h4 className="text-sm font-medium text-voca-dark mb-2">
                        One Agent Per Vendor
                      </h4>
                      <p className="text-xs text-voca-dark">
                        Each vendor can only have one AI agent. You can continuously enhance your agent's capabilities by updating its knowledge base, adding new channels, and improving its responses.
                      </p>
                    </div>
                  </div>
                ) : (
                  // Show create agent option
                  <>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      No Agents Available
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm max-w-sm mx-auto">
                      You haven&apos;t created any AI agents yet. Create your first
                      agent to start managing customer interactions and automate
                      your business processes.
                    </p>
                    <button
                      onClick={onShowCreateAgent}
                      disabled={isLoading}
                      className="bg-voca-cyan text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg hover:bg-voca-dark transition-colors text-sm font-medium shadow-sm hover:shadow-md flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {isLoading ? 'Checking...' : 'Create Your First Agent'}
                    </button>
                    <div className="mt-6 p-3 sm:p-4 bg-voca-light rounded-lg border border-voca-light text-left">
                      <h4 className="text-sm font-medium text-voca-dark mb-2">
                        What can AI agents do?
                      </h4>
                      <ul className="text-xs text-voca-dark space-y-1">
                        <li>• Handle customer inquiries 24/7</li>
                        <li>• Process orders and track deliveries</li>
                        <li>• Provide product recommendations</li>
                        <li>• Manage social media interactions</li>
                        <li>• Support multiple languages</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
