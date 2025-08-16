import { SocialMediaAgentData } from '@/types/agent';
import { generateUuid, formatDate } from '@/lib/utils';

export interface Agent {
  id: string;
  name: string;
  role: string;
  businessType: string;
  status: 'active' | 'inactive' | 'training';
  channels: string[];
  languages: string[];
  createdAt: string;
  lastActive: string;
  knowledgeBase: boolean;
  knowledgeBaseData: {
    name?: string;
    fileCount?: number;
    sourceCount?: number;
    lastUpdated?: string;
  } | null;
  agentData: SocialMediaAgentData;
}

export interface AgentApiResponse {
  success: boolean;
  data: Agent | Agent[] | null;
  message: string;
}

class AgentStore {
  private agents: Map<string, Agent> = new Map();
  private nextId: number = 1;
  private storageKey = 'voca_agents';

  constructor() {
    // Load agents from localStorage if available
    this.loadFromStorage();
    
    // Do not automatically initialize with mock data - return empty state instead
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const agentArray = JSON.parse(stored);
          this.agents.clear();
          agentArray.forEach((agent: Agent) => {
            this.agents.set(agent.id, agent);
          });
          console.log('Loaded agents from localStorage:', this.agents.size, 'at', formatDate(new Date()));
        }
      }
    } catch (error) {
      console.error('Error loading agents from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        const agentArray = Array.from(this.agents.values());
        localStorage.setItem(this.storageKey, JSON.stringify(agentArray));
        console.log('Saved agents to localStorage:', agentArray.length, 'at', formatDate(new Date()));
      }
    } catch (error) {
      console.error('Error saving agents to localStorage:', error);
    }
  }

  // CRUD operations
  createAgent(agentData: SocialMediaAgentData, businessType: string = 'retail'): Agent {
    const agentId = generateUuid();
    
    const newAgent: Agent = {
      id: agentId,
      name: agentData.profile.name,
      role: agentData.profile.role,
      businessType,
      status: 'active',
      channels: Object.keys(agentData.customerService.channels).filter(
        key => agentData.customerService.channels[key as keyof typeof agentData.customerService.channels]
      ),
      languages: agentData.customerService.languages,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      knowledgeBase: false,
      knowledgeBaseData: null,
      agentData
    };

    console.log('Before adding agent, current agents count:', this.agents.size);
    console.log('Adding agent with ID:', agentId, 'Name:', newAgent.name);
    
    this.agents.set(agentId, newAgent);
    this.saveToStorage();
    
    console.log('After adding agent, current agents count:', this.agents.size);
    console.log('All agents in store:', Array.from(this.agents.values()).map(a => ({ id: a.id, name: a.name })));
    console.log('Created new agent:', newAgent.name, 'with ID:', agentId, 'at', formatDate(new Date()));
    return newAgent;
  }

  getAgentById(agentId: string): Agent | null {
    return this.agents.get(agentId) || null;
  }

  getAllAgents(): Agent[] {
    const agents = Array.from(this.agents.values());
    console.log('getAllAgents called, returning:', agents.length, 'agents');
    console.log('Agent IDs:', agents.map(a => ({ id: a.id, name: a.name })));
    return agents;
  }

  updateAgent(agentId: string, updates: Partial<Agent>): Agent | null {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return null;
    }

    const updatedAgent = { ...agent, ...updates, updatedAt: new Date().toISOString() };
    this.agents.set(agentId, updatedAgent);
    this.saveToStorage();
    
    console.log('Updated agent:', agentId, 'at', formatDate(new Date()));
    return updatedAgent;
  }

  deleteAgent(agentId: string): boolean {
    const deleted = this.agents.delete(agentId);
    if (deleted) {
      this.saveToStorage();
      console.log('Deleted agent:', agentId, 'at', formatDate(new Date()));
    }
    return deleted;
  }

  // Utility methods
  getAgentsByBusinessType(businessType: string): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.businessType === businessType);
  }

  getActiveAgents(): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.status === 'active');
  }

  updateLastActive(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastActive = new Date().toISOString();
      this.saveToStorage();
      console.log('Updated last active for agent:', agentId, 'at', formatDate(new Date()));
    }
  }

    // Utility method to clear all agents (for testing purposes)
  clearAllAgents(): void {
    this.agents.clear();
    this.saveToStorage();
    console.log('Cleared all agents at', formatDate(new Date()));
  }

  // Utility method to get current agent count
  getAgentCount(): number {
    return this.agents.size;
  }
}

// Create singleton instance
const agentStore = new AgentStore();

export default agentStore;
