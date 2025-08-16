import { Users, User, AlertCircle } from "lucide-react";
import { SocialMediaAgentData } from "@/types/agent";
import StepLayout from "@/components/layout/StepLayout";

interface ValidationErrors {
  profile?: {
    name?: string;
    bio?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  customerService?: {
    responseTime?: string;
  };
}

interface ProfileStepProps {
  agent: SocialMediaAgentData;
  setAgent: (agent: SocialMediaAgentData) => void;
  validationErrors: {
    profile?: {
      name?: string;
      bio?: string;
    };
  };
  setValidationErrors: (errors: ValidationErrors) => void;
}

export default function ProfileStep({ 
  agent, 
  setAgent, 
  validationErrors, 
  setValidationErrors 
}: ProfileStepProps) {
  return (
    <StepLayout className="p-3 sm:p-4 max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 sm:p-1.5 rounded-md">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                Agent Profile
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                Set up your AI agent&apos;s identity and role
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            {/* Agent Name */}
            <div>
                                   <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                       <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 shrink-0"></span>
                       Agent Name <span className="text-red-500 ml-1">*</span>
                     </label>
                     <div className="relative">
                       <input
                         type="text"
                         value={agent.profile.name}
                         onChange={(e) => {
                           setAgent({
                             ...agent,
                             profile: { ...agent.profile, name: e.target.value },
                           });
                           if (validationErrors.profile?.name) {
                             setValidationErrors({
                               ...validationErrors,
                               profile: { ...validationErrors.profile, name: undefined }
                             });
                           }
                         }}
                         placeholder="e.g., Sarah's Shop Assistant"
                         className={`w-full px-3 py-2 pr-8 border rounded-md text-sm focus:ring-2 transition-all duration-200 ${
                           validationErrors.profile?.name 
                             ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                             : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                         }`}
                       />
                       <div className="absolute right-2 top-1/2 -translate-y-1/2">
                         <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                       </div>
                     </div>
              {validationErrors.profile?.name && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                  <span>{validationErrors.profile.name}</span>
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5 shrink-0"></span>
                Role
              </label>
              <div className="relative">
                <select
                  value={agent.profile.role}
                  onChange={(e) =>
                    setAgent({
                      ...agent,
                      profile: { ...agent.profile, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 appearance-none bg-white"
                >
                  <option value="sales_assistant">Sales Assistant</option>
                  <option value="social_media_manager">
                    Social Media Manager
                  </option>
                  <option value="order_manager">Order Manager</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 shrink-0"></span>
                Agent Bio <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={agent.profile.bio}
                onChange={(e) => {
                  setAgent({
                    ...agent,
                    profile: { ...agent.profile, bio: e.target.value },
                  });
                  if (validationErrors.profile?.bio) {
                    setValidationErrors({
                      ...validationErrors,
                      profile: { ...validationErrors.profile, bio: undefined }
                    });
                  }
                }}
                placeholder="Describe what your AI agent does for your business..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 transition-all duration-200 resize-none ${
                  validationErrors.profile?.bio 
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                    : "border-gray-200 focus:ring-green-500/20 focus:border-green-500"
                }`}
              />
              {validationErrors.profile?.bio && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                  <span>{validationErrors.profile.bio}</span>
                </div>
              )}
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 sm:p-3 rounded-md border border-blue-100">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-1 rounded-sm shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Pro Tip</p>
                  <p className="text-xs text-gray-600">
                    A detailed bio helps your AI agent understand its role better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </StepLayout>
  );
}
