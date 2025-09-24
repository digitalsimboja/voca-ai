'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'
import { apiService } from '@/services/apiService'
import aiAgentService from '@/services/aiAgentService'
import { toast } from '@/utils/toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  type: 'text'
}

interface OrderChatInterfaceProps {
  orderId: string
  orderNumber: string
  agentId?: string
  agentName?: string
  customerName: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function OrderChatInterface({
  orderId,
  orderNumber,
  agentId,
  agentName,
  customerName,
  isCollapsed = false,
  onToggleCollapse
}: OrderChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize conversation when component mounts
  useEffect(() => {
    initializeConversation()
  }, [orderId])

  const initializeConversation = async () => {
    try {
      // Use the order ID directly as the conversation ID (since order ID is already a UUID)
      const deterministicConversationId = orderId
      
      // Validate that orderId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(orderId)) {
        console.error('Order ID is not a valid UUID format:', orderId)
        toast.error('Invalid order ID format')
        return
      }
      
      // First, try to get the existing conversation by ID
      try {
        const existingResponse = await apiService.getConversationDetails(deterministicConversationId)
        if (existingResponse.status === 'success' && existingResponse.data) {
          const existingConversation = existingResponse.data as { conversation: any }
          setConversationId(existingConversation.conversation.id)
          
          // Load existing messages
          const messagesResponse = await apiService.getConversationMessages(deterministicConversationId)
          if (messagesResponse.status === 'success' && messagesResponse.data) {
            const messagesData = messagesResponse.data as { messages: any[] }
            const transformedMessages = messagesData.messages.map(msg => ({
              id: msg.id,
              content: msg.content,
              role: msg.role,
              timestamp: msg.createdAt,
              type: msg.type || 'text'
            }))
            setMessages(transformedMessages)
          } else {
            // No messages yet, set empty array
            setMessages([])
          }
          return
        }
      } catch (error) {
        // Conversation doesn't exist, we'll create it
        console.log('No existing conversation found, creating new one:', error)
      }
      
      // Create a new conversation with deterministic ID
      const response = await apiService.createConversation({
        id: deterministicConversationId, // Pass the deterministic ID
        title: `Order ${orderNumber} - ${customerName}`,
        type: 'order_support',
        metadata: {
          orderId,
          orderNumber,
          agentId,
          agentName,
          customerName
        }
      })

      if (response.status === 'success' && response.data) {
        const conversation = response.data as { id: string }
        setConversationId(conversation.id)
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: `Hello ${customerName}! I'm ${agentName || 'your AI assistant'} and I'm here to help you with your order ${orderNumber}. I can help you with order tracking, delivery updates, payment questions, or any other order-related inquiries. How can I assist you today?`,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          type: 'text'
        }
        setMessages([welcomeMessage])
      } else {
        console.error('Failed to create conversation:', response.message)
        toast.error('Failed to initialize chat. Please try again.')
        setMessages([])
      }
    } catch (error) {
      console.error('Error initializing conversation:', error)
      toast.error('Failed to initialize chat')
      // Set empty state to prevent UI issues
      setConversationId('')
      setMessages([])
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Add user message to conversation
      await apiService.addMessageToConversation(conversationId, {
        content: userMessage.content,
        role: 'user',
        type: 'text',
        metadata: {
          orderId,
          orderNumber
        }
      })

      // Send message to AI agent
      const aiResponse = await aiAgentService.sendMessage(conversationId, userMessage.content, {
        orderId,
        orderNumber,
        agentId,
        customerName
      })

      if (aiResponse.status === 'success' && aiResponse.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.data.response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          type: 'text'
        }

        setMessages(prev => [...prev, assistantMessage])

        // Add assistant message to conversation
        await apiService.addMessageToConversation(conversationId, {
          content: assistantMessage.content,
          role: 'assistant',
          type: 'text',
          metadata: {
            orderId,
            orderNumber,
            agentId,
            agentName: aiResponse.data.agentName
          }
        })
      } else {
        throw new Error('Failed to get AI response')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isCollapsed) {
    return (
      <Card className="w-full rounded-t-xl sm:rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-voca-cyan flex-shrink-0" />
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Order Support Chat</h3>
              <Badge variant="success" size="sm" className="hidden sm:inline-flex">
                {messages.length > 1 ? `${messages.length - 1} messages` : 'New'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1 sm:p-2 flex-shrink-0"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full rounded-t-xl sm:rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-voca-cyan flex-shrink-0" />
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Order Support Chat</h3>
            <Badge variant="success" size="sm" className="hidden sm:inline-flex">
              {agentName || 'AI Assistant'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1 sm:p-2 flex-shrink-0"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Chat with {agentName || 'our AI assistant'} about order {orderNumber}
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages */}
        <div className="h-64 sm:h-80 md:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-voca-cyan text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-voca-cyan mt-0.5 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-voca-light' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-voca-cyan flex-shrink-0" />
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 sm:p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your order..."
              className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-voca-cyan focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-voca-cyan hover:bg-voca-dark text-white px-3 sm:px-4 py-2 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 hidden sm:block">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
