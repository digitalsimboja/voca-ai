import { NextRequest, NextResponse } from 'next/server';

const CONVERSATION_SERVICE_URL = process.env.CONVERSATION_SERVICE_URL || 'http://localhost:8007';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const response = await fetch(`${CONVERSATION_SERVICE_URL}/conversations/${resolvedParams.conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Conversation details API error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch conversation details',
        data: null 
      }, 
      { status: 500 }
    );
  }
}
