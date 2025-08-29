import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('AGENT', `/agents/${agentId}`, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch agent'),
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
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('AGENT', `/agents/${agentId}`, token, {
      method: 'PUT',
      body: JSON.stringify(agentData)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      createErrorResponse('Failed to update agent'),
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
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('AGENT', `/agents/${agentId}`, token, {
      method: 'DELETE'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      createErrorResponse('Failed to delete agent'),
      { status: 500 }
    );
  }
}
