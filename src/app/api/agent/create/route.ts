import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/config/api';

export async function POST(request: NextRequest) {
  try {
    // Get the agent data from the request body
    const agentData = await request.json();

    // Get the authorization token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend agent service
    const response = await fetch(buildApiUrl('AGENT', '/v1/agent/create'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(agentData),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to create agent' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
