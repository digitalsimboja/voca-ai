import React, { useState, useEffect } from 'react';
import {
  User,
  MessageSquare,
  Globe,
  Calendar,
  Database,
  Settings,
  Activity,
  Save,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Agent } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { apiService } from '@/services/apiService';
import { toast } from '@/utils/toast';

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onAgentUpdate?: (updatedAgent: Agent) => void;
  onAgentDelete?: (agentId: string) => void;
}

export default function AgentDetailsModal({
  isOpen,
  onClose,
  agent,
  onAgentUpdate,
  onAgentDelete,
}: AgentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedAgent, setEditedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (agent) {
      setEditedAgent({ ...agent });
    }
  }, [agent]);

  const handleSave = async () => {
    if (!editedAgent) return;
    
    setIsSaving(true);
    try {
      const response = await apiService.updateAgent(editedAgent.id, {
        name: editedAgent.name,
        role: editedAgent.role,
        status: editedAgent.status,
        channels: editedAgent.channels,
        languages: editedAgent.languages,
        agentData: editedAgent.agentData,
      });

      if (response.status === 'success') {
        toast.success('Agent updated successfully!');
        setIsEditing(false);
        if (onAgentUpdate) {
          onAgentUpdate(editedAgent);
        }
      } else {
        toast.error(response.message || 'Failed to update agent');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('An error occurred while updating the agent');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (agent) {
      setEditedAgent({ ...agent });
    }
    setIsEditing(false);
  };

  if (!isOpen || !agent || !editedAgent) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-600 to-purple-600 p-2 sm:p-4 md:p-5 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <User className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedAgent.name}
                    onChange={(e) => setEditedAgent({ ...editedAgent, name: e.target.value })}
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold bg-white/20 rounded px-2 py-1 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Agent name"
                  />
                ) : (
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
                    {editedAgent.name}
                  </h3>
                )}
                <p className="text-[10px] sm:text-xs md:text-sm text-purple-100 truncate">
                  {editedAgent.role} • {editedAgent.businessType}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-1 text-white/90 hover:text-white text-sm transition-colors bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="text-white/80 hover:text-white text-sm transition-colors bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 text-white/90 hover:text-white text-sm transition-colors bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  {onAgentDelete && (
                    <button
                      onClick={() => {
                        if (agent && onAgentDelete) {
                          onAgentDelete(agent.id);
                          onClose();
                        }
                      }}
                      className="flex items-center space-x-1 text-white/80 hover:text-red-200 text-sm transition-colors bg-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </>
              )}
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-base sm:text-lg transition-transform duration-200 hover:scale-110 bg-white/10 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 text-gray-800 text-xs sm:text-sm md:text-base">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Status */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Status</h4>
              </div>
              {isEditing ? (
                <select
                  value={editedAgent.status}
                  onChange={(e) => setEditedAgent({ ...editedAgent, status: e.target.value as 'active' | 'inactive' | 'training' })}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs md:text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="training">Training</option>
                </select>
              ) : (
                <span
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium ${
                    editedAgent.status === 'active'
                      ? 'bg-green-100 text-green-500'
                      : editedAgent.status === 'training'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {editedAgent.status.charAt(0).toUpperCase() + editedAgent.status.slice(1)}
                </span>
              )}
            </div>

            {/* Created */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Created</h4>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-700 break-words font-medium">
                {formatDate(agent.createdAt)}
              </p>
            </div>

            {/* Last Active */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Last Active</h4>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-700 break-words font-medium">
                {formatDate(agent.lastActive)}
              </p>
            </div>
          </div>

          {/* Communication Channels */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Communication Channels</h4>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                {['voice', 'whatsapp', 'instagram_dm', 'facebook_messenger'].map((channel) => (
                  <label key={channel} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedAgent.channels.includes(channel)}
                      onChange={(e) => {
                        const newChannels = e.target.checked
                          ? [...editedAgent.channels, channel]
                          : editedAgent.channels.filter(c => c !== channel);
                        setEditedAgent({ ...editedAgent, channels: newChannels });
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 capitalize">
                      {channel.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {editedAgent.channels.map((channel) => (
                  <span
                    key={channel}
                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border border-purple-200"
                  >
                    {channel.replace('_', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Supported Languages</h4>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                {['English', 'Igbo', 'Yoruba', 'Hausa', 'French', 'Spanish'].map((language) => (
                  <label key={language} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedAgent.languages.includes(language)}
                      onChange={(e) => {
                        const newLanguages = e.target.checked
                          ? [...editedAgent.languages, language]
                          : editedAgent.languages.filter(l => l !== language);
                        setEditedAgent({ ...editedAgent, languages: newLanguages });
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">
                      {language}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {editedAgent.languages.map((language) => (
                  <span
                    key={language}
                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 text-green-500 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border border-green-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Knowledge Base */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Knowledge Base</h4>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    agent.knowledgeBase ? 'text-green-400' : 'text-red-600'
                  }`}
                >
                  {agent.knowledgeBase ? 'Connected' : 'Not Connected'}
                </span>
                {agent.knowledgeBase && agent.knowledgeBaseData && (
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    {agent.knowledgeBaseData.fileCount || 0} files,{' '}
                    {agent.knowledgeBaseData.sourceCount || 0} sources
                  </p>
                )}
              </div>
              <button className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-semibold whitespace-nowrap bg-purple-50 px-2 py-1 rounded-md border border-purple-200 hover:bg-purple-100 transition-colors">
                {agent.knowledgeBase ? 'Manage' : 'Connect'}
              </button>
            </div>
          </div>

          {/* Agent Configuration */}
          {agent.agentData && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 space-y-3 sm:space-y-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Agent Configuration</h4>
              </div>

              {/* Profile */}
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                <h5 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 sm:mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                  Profile
                </h5>
                <p className="text-xs sm:text-sm text-gray-700 break-words font-medium">
                  {agent.agentData?.profile?.bio || 'No bio available'}
                </p>
              </div>

              {/* Social Media Platforms */}
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                <h5 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 sm:mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                  Social Media Platforms
                </h5>
                <div className="space-y-0.5 sm:space-y-1">
                  {agent.agentData?.socialMedia?.platforms ? 
                    Object.entries(agent.agentData.socialMedia.platforms).map(
                      ([platform, config]) => (
                        <div
                          key={platform}
                          className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm"
                        >
                          <span className="capitalize break-words font-medium">{platform}</span>
                          <span
                            className={`mt-0.5 sm:mt-0 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border ${
                              config.enabled
                                ? 'bg-green-100 text-green-500 border-green-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {config.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      )
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">No social media platforms configured</p>
                    )
                  }
                </div>
              </div>

              {/* Customer Service */}
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                <h5 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 sm:mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Customer Service
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Response Time:</span>
                    <span className="ml-1 text-gray-900 font-semibold">
                      {agent.agentData?.customerService?.responseTime || 'Not set'} minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Auto Responses:</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border ${
                        agent.agentData?.customerService?.autoResponses
                          ? 'bg-green-100 text-green-500 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {agent.agentData?.customerService?.autoResponses ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Capabilities */}
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                <h5 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 sm:mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
                  AI Capabilities
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {agent.agentData?.aiCapabilities ? 
                    Object.entries(agent.agentData.aiCapabilities).map(
                      ([capability, enabled]) => (
                        <div
                          key={capability}
                          className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm"
                        >
                          <span className="capitalize break-words font-medium">
                            {capability.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span
                            className={`mt-0.5 sm:mt-0 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border ${
                              enabled
                                ? 'bg-green-100 text-green-500 border-green-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      )
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">No AI capabilities configured</p>
                    )
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-2 sm:p-3 md:p-4 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 bg-white font-semibold border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-white bg-purple-600 font-semibold border border-purple-600 rounded-md hover:bg-purple-700 hover:border-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 bg-white font-semibold border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
