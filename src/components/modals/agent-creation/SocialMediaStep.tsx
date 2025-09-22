import { Instagram, Facebook, Twitter, AlertCircle } from "lucide-react";
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
    twitter?: string;
  };
  customerService?: {
    responseTime?: string;
  };
}

interface SocialMediaStepProps {
  agent: SocialMediaAgentData;
  setAgent: (agent: SocialMediaAgentData) => void;
  validationErrors: {
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      tiktok?: string;
      twitter?: string;
    };
  };
  setValidationErrors: (errors: ValidationErrors) => void;
}

export default function SocialMediaStep({
  agent,
  setAgent,
  validationErrors,
  setValidationErrors,
}: SocialMediaStepProps) {
  return (
    <StepLayout>
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50 to-voca-light p-3 sm:p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-voca-cyan p-1.5 rounded-md">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Social Media Platforms
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Connect your social media accounts for seamless integration
              </p>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Instagram */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-md">
                    <Instagram className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Instagram
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Connect your Instagram business account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.instagram.enabled}
                    onChange={(e) => {
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            instagram: {
                              ...agent.socialMedia.platforms.instagram,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      });
                      if (validationErrors.socialMedia?.instagram) {
                        setValidationErrors({
                          ...validationErrors,
                          socialMedia: {
                            ...validationErrors.socialMedia,
                            instagram: undefined,
                          },
                        });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-10 sm:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-rose-500"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.instagram.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2 sm:p-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></span>
                      Instagram Handle <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1 text-xs font-medium">@</span>
                      <input
                        type="text"
                        value={agent.socialMedia.platforms.instagram.handle}
                        onChange={(e) => {
                          setAgent({
                            ...agent,
                            socialMedia: {
                              ...agent.socialMedia,
                              platforms: {
                                ...agent.socialMedia.platforms,
                                instagram: {
                                  ...agent.socialMedia.platforms.instagram,
                                  handle: e.target.value,
                                },
                              },
                            },
                          });
                          if (validationErrors.socialMedia?.instagram) {
                            setValidationErrors({
                              ...validationErrors,
                              socialMedia: {
                                ...validationErrors.socialMedia,
                                instagram: undefined,
                              },
                            });
                          }
                        }}
                        placeholder="your_shop_name"
                        className={`flex-1 px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-xs sm:text-sm ${
                          validationErrors.socialMedia?.instagram
                            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                            : "border-pink-200"
                        }`}
                      />
                    </div>
                    {validationErrors.socialMedia?.instagram && (
                      <div className="flex items-center mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.socialMedia.instagram}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* TikTok */}
            <div className="bg-gradient-to-r from-cyan-50 via-pink-50 to-voca-light border border-cyan-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-cyan-500 via-pink-500 to-voca-cyan p-1.5 rounded-md shadow-lg">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">TikTok</h4>
                    <p className="text-gray-600 text-xs">
                      Connect your TikTok account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.tiktok.enabled}
                    onChange={(e) => {
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            tiktok: {
                              ...agent.socialMedia.platforms.tiktok,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      });
                      if (validationErrors.socialMedia?.tiktok) {
                        setValidationErrors({
                          ...validationErrors,
                          socialMedia: {
                            ...validationErrors.socialMedia,
                            tiktok: undefined,
                          },
                        });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-10 sm:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-voca-cyan"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.tiktok.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2 sm:p-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-voca-cyan rounded-full mr-1.5"></span>
                      TikTok Username <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1 text-xs font-medium">@</span>
                      <input
                        type="text"
                        value={agent.socialMedia.platforms.tiktok.username}
                        onChange={(e) => {
                          setAgent({
                            ...agent,
                            socialMedia: {
                              ...agent.socialMedia,
                              platforms: {
                                ...agent.socialMedia.platforms,
                                tiktok: {
                                  ...agent.socialMedia.platforms.tiktok,
                                  username: e.target.value,
                                },
                              },
                            },
                          });
                          if (validationErrors.socialMedia?.tiktok) {
                            setValidationErrors({
                              ...validationErrors,
                              socialMedia: {
                                ...validationErrors.socialMedia,
                                tiktok: undefined,
                              },
                            });
                          }
                        }}
                        placeholder="your_shop_name"
                        className={`flex-1 px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 text-xs sm:text-sm ${
                          validationErrors.socialMedia?.tiktok
                            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                            : "border-cyan-200"
                        }`}
                      />
                    </div>
                    {validationErrors.socialMedia?.tiktok && (
                      <div className="flex items-center mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.socialMedia.tiktok}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Facebook */}
            <div className="bg-gradient-to-r from-voca-light to-indigo-50 border border-voca-light rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-voca-cyan to-indigo-500 p-1.5 rounded-md">
                    <Facebook className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Facebook
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Connect your Facebook page and messenger
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.facebook.enabled}
                    onChange={(e) => {
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            facebook: {
                              ...agent.socialMedia.platforms.facebook,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      });
                      if (validationErrors.socialMedia?.facebook) {
                        setValidationErrors({
                          ...validationErrors,
                          socialMedia: {
                            ...validationErrors.socialMedia,
                            facebook: undefined,
                          },
                        });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-10 sm:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-voca-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-voca-cyan peer-checked:to-indigo-500"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.facebook.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2 sm:p-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-voca-cyan rounded-full mr-1.5"></span>
                      Facebook Page Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={agent.socialMedia.platforms.facebook.page}
                      onChange={(e) => {
                        setAgent({
                          ...agent,
                          socialMedia: {
                            ...agent.socialMedia,
                            platforms: {
                              ...agent.socialMedia.platforms,
                              facebook: {
                                ...agent.socialMedia.platforms.facebook,
                                page: e.target.value,
                              },
                            },
                          },
                        });
                        if (validationErrors.socialMedia?.facebook) {
                          setValidationErrors({
                            ...validationErrors,
                            socialMedia: {
                              ...validationErrors.socialMedia,
                              facebook: undefined,
                            },
                          });
                        }
                      }}
                      placeholder="Your Shop Name"
                      className={`w-full px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-voca-cyan/20 focus:border-voca-cyan transition-all duration-200 text-xs sm:text-sm ${
                        validationErrors.socialMedia?.facebook
                          ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                          : "border-voca-light"
                      }`}
                    />
                    {validationErrors.socialMedia?.facebook && (
                      <div className="flex items-center mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.socialMedia.facebook}
                      </div>
                    )}
                  </div>

                  <label className="flex items-center p-2 bg-voca-light rounded-md border border-voca-light hover:bg-voca-light transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agent.socialMedia.platforms.facebook.messenger}
                      onChange={(e) =>
                        setAgent({
                          ...agent,
                          socialMedia: {
                            ...agent.socialMedia,
                            platforms: {
                              ...agent.socialMedia.platforms,
                              facebook: {
                                ...agent.socialMedia.platforms.facebook,
                                messenger: e.target.checked,
                              },
                            },
                          },
                        })
                      }
                      className="mr-2 w-4 h-4 text-voca-cyan focus:ring-voca-cyan border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-xs font-medium text-gray-900">
                        Facebook Messenger
                      </span>
                      <p className="text-xs text-gray-600">
                        Enable messenger integration for customer support
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Twitter */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-1.5 rounded-md">
                    <Twitter className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Twitter
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Connect your Twitter account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
                  <input
                    type="checkbox"
                    checked={agent.socialMedia.platforms.twitter.enabled}
                    onChange={(e) => {
                      setAgent({
                        ...agent,
                        socialMedia: {
                          ...agent.socialMedia,
                          platforms: {
                            ...agent.socialMedia.platforms,
                            twitter: {
                              ...agent.socialMedia.platforms.twitter,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      });
                      if (validationErrors.socialMedia?.twitter) {
                        setValidationErrors({
                          ...validationErrors,
                          socialMedia: {
                            ...validationErrors.socialMedia,
                            twitter: undefined,
                          },
                        });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-10 sm:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-sky-500"></div>
                </label>
              </div>

              {agent.socialMedia.platforms.twitter.enabled && (
                <div className="space-y-2 bg-white/60 rounded-md p-2 sm:p-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                      Twitter Username <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1 text-xs font-medium">@</span>
                      <input
                        type="text"
                        value={agent.socialMedia.platforms.twitter.username}
                        onChange={(e) => {
                          setAgent({
                            ...agent,
                            socialMedia: {
                              ...agent.socialMedia,
                              platforms: {
                                ...agent.socialMedia.platforms,
                                twitter: {
                                  ...agent.socialMedia.platforms.twitter,
                                  username: e.target.value,
                                },
                              },
                            },
                          });
                          if (validationErrors.socialMedia?.twitter) {
                            setValidationErrors({
                              ...validationErrors,
                              socialMedia: {
                                ...validationErrors.socialMedia,
                                twitter: undefined,
                              },
                            });
                          }
                        }}
                        placeholder="your_shop_name"
                        className={`flex-1 px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-xs sm:text-sm ${
                          validationErrors.socialMedia?.twitter
                            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                            : "border-blue-200"
                        }`}
                      />
                    </div>
                    {validationErrors.socialMedia?.twitter && (
                      <div className="flex items-center mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.socialMedia.twitter}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </StepLayout>
  );
}
