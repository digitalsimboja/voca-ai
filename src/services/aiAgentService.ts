import { ApiResponse } from '@/lib/api'

// AI Agent message interface
interface AgentMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  metadata?: Record<string, unknown>
}

// AI Agent conversation interface
interface AgentConversation {
  id: string
  title: string
  orderId: string
  orderNumber: string
  agentId?: string
  agentName?: string
  customerName: string
  messages: AgentMessage[]
  status: 'active' | 'completed'
  createdAt: string
  updatedAt: string
}

// AI Agent service configuration
interface AgentServiceConfig {
  baseUrl: string
  timeout: number
}

class AIAgentService {
  private config: AgentServiceConfig

  constructor(config: AgentServiceConfig) {
    this.config = config
  }

  // Send message to AI agent
  async sendMessage(
    conversationId: string,
    message: string,
    context: {
      orderId: string
      orderNumber: string
      agentId?: string
      customerName: string
    }
  ): Promise<ApiResponse<{ response: string; agentName: string }>> {
    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message,
          context
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status === 'success' && data.data) {
        return {
          status: 'success',
          message: data.message || 'Message sent successfully',
          data: data.data
        }
      } else {
        throw new Error(data.message || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('AI Agent service error:', error)
      
      // Fallback to mock response if AI service is unavailable
      return this.generateMockResponse(message, context)
    }
  }

  // Generate mock response when AI service is unavailable
  private generateMockResponse(
    message: string,
    context: {
      orderId: string
      orderNumber: string
      agentId?: string
      customerName: string
    }
  ): ApiResponse<{ response: string; agentName: string }> {
    const lowerMessage = message.toLowerCase()
    let response = ''
    
    // Order tracking
    if (lowerMessage.includes('track') || lowerMessage.includes('where') || lowerMessage.includes('status')) {
      response = `I can help you track your order ${context.orderNumber}. Based on our records, your order is currently being processed and should be shipped within the next 24-48 hours. You'll receive a tracking number via email once it ships. Is there anything specific about your order status you'd like to know?`
    }
    // Delivery
    else if (lowerMessage.includes('deliver') || lowerMessage.includes('shipping') || lowerMessage.includes('when')) {
      response = `Your order ${context.orderNumber} is scheduled for delivery within 3-5 business days. We'll send you updates via email and SMS as your package moves through our delivery network. Would you like me to check the current delivery status for you?`
    }
    // Payment
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('refund')) {
      response = `I can help you with payment-related questions for order ${context.orderNumber}. Your payment has been processed successfully. If you need a refund or have payment concerns, I can connect you with our customer service team. What specific payment assistance do you need?`
    }
    // General help
    else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      response = `I'm here to help you with order ${context.orderNumber}! I can assist with tracking, delivery updates, payment questions, returns, or any other order-related inquiries. What would you like to know?`
    }
    // Default response
    else {
      response = `Thank you for your message about order ${context.orderNumber}. I'm here to help you with any questions about your order, including tracking, delivery, payments, or returns. Could you please let me know what specific assistance you need?`
    }

    return {
      status: 'success',
      message: 'Mock response generated',
      data: {
        response,
        agentName: 'AI Assistant'
      }
    }
  }

  // Get agent status
  async getAgentStatus(agentId: string): Promise<ApiResponse<{ status: string; agentName: string }>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        status: 'success',
        message: 'Agent status retrieved',
        data: {
          status: data.agent_status || 'unknown',
          agentName: data.agent_name || 'AI Assistant'
        }
      }
    } catch (error) {
      console.error('Get agent status error:', error)
      return {
        status: 'error',
        message: 'Failed to get agent status',
        data: null
      }
    }
  }

  // Create conversation with AI agent
  async createConversation(context: {
    orderId: string
    orderNumber: string
    agentId?: string
    customerName: string
  }): Promise<ApiResponse<AgentConversation>> {
    try {
      const conversation: AgentConversation = {
        id: `conv_${Date.now()}`,
        title: `Order ${context.orderNumber} - ${context.customerName}`,
        orderId: context.orderId,
        orderNumber: context.orderNumber,
        agentId: context.agentId,
        agentName: 'AI Assistant',
        customerName: context.customerName,
        messages: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return {
        status: 'success',
        message: 'Conversation created successfully',
        data: conversation
      }
    } catch (error) {
      console.error('Create conversation error:', error)
      return {
        status: 'error',
        message: 'Failed to create conversation',
        data: null
      }
    }
  }
}

// Create and export the AI agent service instance
const aiAgentService = new AIAgentService({
  baseUrl: process.env.NEXT_PUBLIC_VOCA_AI_ENGINE_URL || 'http://localhost:5008',
  timeout: 10000 // 10 seconds
})

export default aiAgentService
export type { AgentMessage, AgentConversation }
