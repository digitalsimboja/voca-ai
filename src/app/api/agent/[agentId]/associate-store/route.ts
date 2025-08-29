import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const { agentId } = await params;
    const { store_id } = await request.json();
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }
    
    if (!store_id) {
      return NextResponse.json(
        createErrorResponse('Store ID is required'),
        { status: 400 }
      );
    }
    
    const response = await makeAuthenticatedApiCall('AGENT', `/agents/${agentId}/associate-store`, token, {
      method: 'PUT',
      body: JSON.stringify({ store_id })
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error associating agent with store:', error);
    return NextResponse.json(
      createErrorResponse('Failed to associate agent with store'),
      { status: 500 }
    );
  }
}
