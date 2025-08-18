import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    // Get the authorization token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend agent service
    const response = await fetch(
      buildApiUrl('AGENT', `/v1/agent/agents/${agentId}`),
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to fetch agent' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
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
    const response = await fetch(
      buildApiUrl('AGENT', `/v1/agent/agents/${agentId}`),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(agentData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to update agent' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    // Get the authorization token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend agent service
    const response = await fetch(
      buildApiUrl('AGENT', `/v1/agent/agents/${agentId}`),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to delete agent' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
