import { NextRequest, NextResponse } from 'next/server'

const VOCA_AI_ENGINE_URL = process.env.VOCA_AI_ENGINE_URL || 'http://localhost:5008'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies for authentication
    const token = request.cookies.get('voca_auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { conversationId, message, context } = body

    if (!message || !context) {
      return NextResponse.json(
        { status: 'error', message: 'Message and context are required' },
        { status: 400 }
      )
    }

    // Forward the request to the voca-ai-engine
    const response = await fetch(`${VOCA_AI_ENGINE_URL}/api/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        vendor_id: context.agentId || 'default',
        message: message,
        platform: 'web',
        user_id: `order_${context.orderId}`,
        context: {
          orderId: context.orderId,
          orderNumber: context.orderNumber,
          customerName: context.customerName,
          conversationId: conversationId
        }
      }),
    })

    if (!response.ok) {
      // If AI engine is not available, return a mock response
      const mockResponse = generateMockResponse(message, context)
      return NextResponse.json({
        status: 'success',
        message: 'Mock response generated (AI engine unavailable)',
        data: mockResponse
      })
    }

    const data = await response.json()
    
    return NextResponse.json({
      status: 'success',
      message: 'Message processed successfully',
      data: {
        response: data.response || 'I apologize, but I encountered an error processing your request.',
        agentName: data.character || 'AI Assistant'
      }
    })

  } catch (error) {
    console.error('AI Agent API error:', error)
    
    // Return mock response on error
    const body = await request.json()
    const { message, context } = body
    const mockResponse = generateMockResponse(message, context)
    
    return NextResponse.json({
      status: 'success',
      message: 'Mock response generated (service error)',
      data: mockResponse
    })
  }
}

function generateMockResponse(message: string, context: any) {
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
    response,
    agentName: 'AI Assistant'
  }
}
