import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card"; // lowercase 'card' for shadcn
import { Zap, Database } from "lucide-react";

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Integration Settings
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* AWS Settings */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    AWS Configuration
                  </h4>
                  <p className="text-sm text-gray-500">
                    Manage AWS service connections
                  </p>
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium w-full md:w-auto">
                Configure
              </button>
            </div>

            {/* Database Settings */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Database Settings
                  </h4>
                  <p className="text-sm text-gray-500">
                    Configure data storage options
                  </p>
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium w-full md:w-auto">
                Configure
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
