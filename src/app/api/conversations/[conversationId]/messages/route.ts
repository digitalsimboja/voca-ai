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

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const resolvedParams = await params;
    const response = await fetch(`${CONVERSATION_SERVICE_URL}/conversations/${resolvedParams.conversationId}/messages${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Conversation messages API error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch conversation messages',
        data: null 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    
    const resolvedParams = await params;
    const response = await fetch(`${CONVERSATION_SERVICE_URL}/conversations/${resolvedParams.conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Conversation messages API error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to add message to conversation',
        data: null 
      }, 
      { status: 500 }
    );
  }
}
