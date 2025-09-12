# AI Agent Integration for Order Support

This document describes the AI agent integration feature that allows customers to chat with AI agents about their orders directly from the order detail page.

## Overview

The AI agent integration provides a chat interface where customers can:
- Ask questions about their order status
- Get delivery updates
- Inquire about payments and refunds
- Receive general order support

## Architecture

```
Frontend (Voca AI) → API Route → Voca AI Engine → ElizaOS Agent
```

### Components

1. **OrderChatInterface** (`src/components/chat/OrderChatInterface.tsx`)
   - React component for the chat UI
   - Handles message display and user input
   - Integrates with AI agent service

2. **AI Agent Service** (`src/services/aiAgentService.ts`)
   - Service layer for AI agent communication
   - Handles message sending and response processing
   - Provides fallback mock responses

3. **API Route** (`src/app/api/ai-agent/route.ts`)
   - Next.js API route for AI agent communication
   - Handles authentication and request forwarding
   - Provides error handling and fallback responses

4. **Order Detail Page** (`src/app/orders/[id]/page.tsx`)
   - Enhanced with chat interface integration
   - Includes "Chat with AI" button in header
   - Collapsible chat interface in sidebar

## Features

### Chat Interface
- **Real-time messaging**: Send and receive messages instantly
- **Collapsible design**: Can be minimized to save space
- **Auto-scroll**: Automatically scrolls to latest messages
- **Loading states**: Shows typing indicators during AI processing
- **Error handling**: Graceful fallback when AI service is unavailable

### AI Agent Capabilities
- **Order tracking**: Provide order status and tracking information
- **Delivery updates**: Share delivery timelines and status
- **Payment support**: Handle payment and refund inquiries
- **General assistance**: Answer order-related questions

### Integration Points
- **Voca AI Engine**: Connects to the main AI engine for processing
- **ElizaOS**: Uses ElizaOS agents for natural language processing
- **Conversation API**: Stores chat history and context
- **Authentication**: Secure communication with proper auth tokens

## Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env.local` file:

```bash
# AI Agent Engine Configuration
VOCA_AI_ENGINE_URL=http://localhost:5008
NEXT_PUBLIC_VOCA_AI_ENGINE_URL=http://localhost:5008

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://localhost:8000
```

### 2. Service Dependencies

Ensure the following services are running:
- **Voca AI Frontend**: `npm run dev` (port 3000)
- **Voca AI Backend**: Running on port 8000
- **Voca AI Engine**: Running on port 5008
- **Voca OS Service**: Running on port 3001

### 3. AI Agent Configuration

The AI agent integration works with:
- **Default agent**: Uses a generic AI assistant when no specific agent is assigned
- **Vendor agents**: Can use specific vendor AI agents when available
- **Mock responses**: Provides intelligent fallback responses when AI service is unavailable

## Usage

### For Customers

1. Navigate to an order detail page (`/orders/[id]`)
2. Click the "Chat with AI" button in the header or expand the chat interface
3. Type your question about the order
4. Receive AI-powered responses about order status, delivery, payments, etc.

### For Developers

#### Adding Chat to Other Pages

```tsx
import OrderChatInterface from '@/components/chat/OrderChatInterface'

<OrderChatInterface
  orderId="order-123"
  orderNumber="ORD-001"
  agentId="agent-456"
  agentName="Customer Support AI"
  customerName="John Doe"
  isCollapsed={false}
  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
/>
```

#### Customizing AI Responses

Modify the `generateMockResponse` function in `src/app/api/ai-agent/route.ts` to customize fallback responses:

```typescript
function generateMockResponse(message: string, context: any) {
  const lowerMessage = message.toLowerCase()
  
  // Add your custom response logic here
  if (lowerMessage.includes('custom_keyword')) {
    return {
      response: 'Your custom response here',
      agentName: 'Custom AI Assistant'
    }
  }
  
  // Default response
  return {
    response: 'Default response',
    agentName: 'AI Assistant'
  }
}
```

## API Endpoints

### POST /api/ai-agent

Send a message to the AI agent.

**Request Body:**
```json
{
  "conversationId": "conv_123",
  "message": "Where is my order?",
  "context": {
    "orderId": "order_456",
    "orderNumber": "ORD-001",
    "agentId": "agent_789",
    "customerName": "John Doe"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Message processed successfully",
  "data": {
    "response": "Your order ORD-001 is currently being processed...",
    "agentName": "AI Assistant"
  }
}
```

## Error Handling

The system includes comprehensive error handling:

1. **AI Service Unavailable**: Falls back to intelligent mock responses
2. **Network Errors**: Graceful degradation with user-friendly messages
3. **Authentication Errors**: Proper error messages for unauthorized access
4. **Invalid Requests**: Validation and helpful error messages

## Future Enhancements

- **Voice Integration**: Add voice chat capabilities
- **File Attachments**: Support for image and document sharing
- **Multi-language Support**: Internationalization for global customers
- **Advanced AI Features**: Integration with more sophisticated AI models
- **Analytics**: Track chat performance and customer satisfaction
- **Escalation**: Automatic escalation to human agents when needed

## Troubleshooting

### Common Issues

1. **Chat not loading**: Check if all services are running
2. **No AI responses**: Verify voca-ai-engine is accessible
3. **Authentication errors**: Ensure proper JWT tokens are set
4. **CORS issues**: Check environment variable configuration

### Debug Mode

Enable debug logging by setting `DEBUG=true` in your environment variables.

## Security Considerations

- All communications are authenticated using JWT tokens
- API routes validate user permissions
- Sensitive order data is properly sanitized
- AI responses are filtered for security

## Performance

- Chat interface uses efficient React state management
- Messages are paginated for large conversations
- AI responses are cached when possible
- Fallback responses ensure consistent user experience
