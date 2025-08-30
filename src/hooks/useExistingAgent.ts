import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/apiService';
import { Agent } from '@/lib/types';

interface ExistingAgentData {
  has_agent: boolean;
  agent: Agent | null;
}

interface UseExistingAgentReturn {
  existingAgent: Agent | null;
  hasExistingAgent: boolean;
  isLoading: boolean;
  error: string | null;
  checkExistingAgent: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useExistingAgent(): UseExistingAgentReturn {
  const [existingAgent, setExistingAgent] = useState<Agent | null>(null);
  const [hasExistingAgent, setHasExistingAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkExistingAgent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.checkExistingAgent();
      
      if (response.status === 'success' && response.data) {
        const data = response.data as ExistingAgentData;
        setHasExistingAgent(data.has_agent);
        setExistingAgent(data.agent);
      } else {
        setError(response.message || 'Failed to check existing agent');
        setHasExistingAgent(false);
        setExistingAgent(null);
      }
    } catch (err) {
      console.error('Error checking existing agent:', err);
      setError('Failed to check existing agent');
      setHasExistingAgent(false);
      setExistingAgent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await checkExistingAgent();
  };

  // Check on mount
  useEffect(() => {
    checkExistingAgent();
  }, []);

  // Memoize the refetch function to prevent unnecessary re-renders
  const memoizedRefetch = useCallback(refetch, []);

  return {
    existingAgent,
    hasExistingAgent,
    isLoading,
    error,
    checkExistingAgent,
    refetch: memoizedRefetch
  };
}
