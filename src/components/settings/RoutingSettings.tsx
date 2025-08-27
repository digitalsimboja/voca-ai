import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Settings } from "lucide-react";
import { Settings as SettingsType, Agent } from "@/lib/types";

interface RoutingSettingsProps {
  settings: SettingsType & { agents: Agent[] };
  onSettingsChange: (settings: SettingsType & { agents: Agent[] }) => void;
}

export default function RoutingSettings({ settings }: RoutingSettingsProps) {
  return (
    <div className="space-y-6 px-2 sm:px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Routing Rules
            </h3>
            <button className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">
              Add Rule
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.routingRules.map((rule) => (
              <div
                key={rule.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {rule.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={rule.enabled ? "success" : "default"}
                      size="sm"
                    >
                      {rule.enabled ? "Active" : "Inactive"}
                    </Badge>
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600">
                      <span className="font-medium">Keywords:</span>{" "}
                      {rule.conditions.keywords.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Route to:</span>{" "}
                      {rule.actions.routeTo}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600">
                      <span className="font-medium">Priority:</span>{" "}
                      {rule.actions.priority}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Language:</span>{" "}
                      {rule.conditions.language}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
