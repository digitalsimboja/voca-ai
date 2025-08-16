import React from 'react';
import {
  User,
  MessageSquare,
  Globe,
  Calendar,
  Database,
  Settings,
  Activity,
} from 'lucide-react';
import { Agent } from '@/lib/agentStore';
import { formatDate } from '@/lib/utils';

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

export default function AgentDetailsModal({
  isOpen,
  onClose,
  agent,
}: AgentDetailsModalProps) {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-2 sm:p-4 md:p-5 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <User className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
                  {agent.name}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-blue-100 truncate">
                  {agent.role} • {agent.businessType}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-base sm:text-lg transition-transform duration-200 hover:scale-110 bg-white/10 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 text-gray-800 text-xs sm:text-sm md:text-base">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Status */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Status</h4>
              </div>
              <span
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium ${
                  agent.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : agent.status === 'training'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </span>
            </div>

            {/* Created */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Created</h4>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-700 break-words font-medium">
                {formatDate(agent.createdAt)}
              </p>
            </div>

            {/* Last Active */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
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
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Communication Channels</h4>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {agent.channels.map((channel) => (
                <span
                  key={channel}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border border-blue-200"
                >
                  {channel.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Supported Languages</h4>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {agent.languages.map((language) => (
                <span
                  key={language}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border border-green-200"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Knowledge Base */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-200">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Knowledge Base</h4>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    agent.knowledgeBase ? 'text-green-600' : 'text-red-600'
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
              <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold whitespace-nowrap bg-blue-50 px-2 py-1 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                {agent.knowledgeBase ? 'Manage' : 'Connect'}
              </button>
            </div>
          </div>

          {/* Agent Configuration */}
          {agent.agentData && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 md:p-4 space-y-3 sm:space-y-4 border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Agent Configuration</h4>
              </div>

              {/* Profile */}
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                <h5 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 sm:mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  Profile
                </h5>
                <p className="text-xs sm:text-sm text-gray-700 break-words font-medium">
                  {agent.agentData.profile.bio}
                </p>
              </div>

              {/* Social Media Platforms */}
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                <h5 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 sm:mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                  Social Media Platforms
                </h5>
                <div className="space-y-0.5 sm:space-y-1">
                  {Object.entries(agent.agentData.socialMedia.platforms).map(
                    ([platform, config]) => (
                      <div
                        key={platform}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm"
                      >
                        <span className="capitalize break-words font-medium">{platform}</span>
                        <span
                          className={`mt-0.5 sm:mt-0 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border ${
                            config.enabled
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {config.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    )
                  )}
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
                      {agent.agentData.customerService.responseTime} minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Auto Responses:</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border ${
                        agent.agentData.customerService.autoResponses
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {agent.agentData.customerService.autoResponses ? 'Enabled' : 'Disabled'}
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
                  {Object.entries(agent.agentData.aiCapabilities).map(
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
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-2 sm:p-3 md:p-4 border-t border-gray-200">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 bg-white font-semibold border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
